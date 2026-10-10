'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';
import { isUuid } from '@/lib/ids';
import { redirect } from 'next/navigation';

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.').refine((value) => {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, 'Enter a valid date.');

const policySchema = z.object({
  client_id: z.string().uuid('Choose a client.'),
  carrier_id: z.string().uuid('Choose a carrier.'),
  policy_number: z.string().trim().min(1, 'Enter the policy number.').max(100),
  line_of_business: z.string().trim().min(1, 'Enter the line of business.').max(100),
  effective_date: dateOnly,
  expiration_date: dateOnly,
  premium: z.string().trim()
    .regex(/^\d{1,10}(?:\.\d{1,2})?$/, 'Enter a non-negative premium with up to two decimal places.')
    .transform(Number),
  status: z.enum(['ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED']),
  notes: z.string().trim().max(5000, 'Notes must be 5,000 characters or fewer.'),
}).refine((policy) => policy.expiration_date >= policy.effective_date, {
  message: 'Expiration date must be on or after the effective date.',
  path: ['expiration_date'],
});

export type PolicyActionState = {
  message: string;
  errors?: Partial<Record<
    'client_id' | 'carrier_id' | 'policy_number' | 'line_of_business' |
    'effective_date' | 'expiration_date' | 'premium' | 'status' | 'notes',
    string[]
  >>;
};

export async function createPolicy(
  _previousState: PolicyActionState,
  formData: FormData,
): Promise<PolicyActionState> {
  const brokerId = await requireBrokerId();
  const parsed = policySchema.safeParse({
    client_id: formData.get('client_id'),
    carrier_id: formData.get('carrier_id'),
    policy_number: formData.get('policy_number'),
    line_of_business: formData.get('line_of_business'),
    effective_date: formData.get('effective_date'),
    expiration_date: formData.get('expiration_date'),
    premium: formData.get('premium'),
    status: formData.get('status'),
    notes: formData.get('notes') ?? '',
  });

  if (!parsed.success) {
    return {
      message: 'Please correct the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const policy = parsed.data;
  const [clients, carriers] = await Promise.all([
    sql`SELECT id FROM public.clients WHERE id = ${policy.client_id} AND broker_id = ${brokerId} LIMIT 1`,
    sql`SELECT id FROM public.carriers WHERE id = ${policy.carrier_id} LIMIT 1`,
  ]);

  if (clients.length === 0) {
    return { message: 'That client is not available in your account. Refresh and choose a client from your list.' };
  }

  if (carriers.length === 0) {
    return { message: 'That carrier is no longer available. Refresh and choose a carrier again.' };
  }

  try {
    await sql`
      INSERT INTO public.policies (
        broker_id, client_id, carrier_id, policy_number, line_of_business,
        effective_date, expiration_date, premium, status, notes
      )
      VALUES (
        ${brokerId}, ${policy.client_id}, ${policy.carrier_id},
        ${policy.policy_number}, ${policy.line_of_business},
        ${policy.effective_date}, ${policy.expiration_date},
        ${policy.premium}, ${policy.status}, ${policy.notes || null}
      )
    `;
  } catch {
    return { message: 'The policy could not be saved. Please check the information and try again.' };
  }

  revalidatePath('/policies');
  revalidatePath('/clients');
  revalidatePath('/dashboard');
  revalidatePath('/renewals');
  revalidatePath(`/client/${policy.client_id}`);
  return { message: 'Policy saved.' };
}

async function parsePolicy(formData: FormData) {
  return policySchema.safeParse({
    client_id: formData.get('client_id'), carrier_id: formData.get('carrier_id'),
    policy_number: formData.get('policy_number'), line_of_business: formData.get('line_of_business'),
    effective_date: formData.get('effective_date'), expiration_date: formData.get('expiration_date'),
    premium: formData.get('premium'), status: formData.get('status'), notes: formData.get('notes') ?? '',
  });
}

async function relatedRecordsExist(clientId: string, carrierId: string, brokerId: string) {
  const [clients, carriers] = await Promise.all([
    sql`SELECT id FROM public.clients WHERE id = ${clientId} AND broker_id = ${brokerId} LIMIT 1`,
    sql`SELECT id FROM public.carriers WHERE id = ${carrierId} LIMIT 1`,
  ]);
  return { clientExists: clients.length > 0, carrierExists: carriers.length > 0 };
}

export async function updatePolicy(
  _previousState: PolicyActionState,
  formData: FormData,
): Promise<PolicyActionState> {
  const brokerId = await requireBrokerId();
  const id = formData.get('id');
  if (typeof id !== 'string' || !isUuid(id)) return { message: 'This policy link is not valid. Refresh the page and try again.' };
  const parsed = await parsePolicy(formData);
  if (!parsed.success) return { message: 'Please correct the highlighted fields.', errors: parsed.error.flatten().fieldErrors };
  const policy = parsed.data;
  const related = await relatedRecordsExist(policy.client_id, policy.carrier_id, brokerId);
  if (!related.clientExists) return { message: 'Choose a client from your account.' };
  if (!related.carrierExists) return { message: 'Choose an available carrier.' };
  try {
    const rows = await sql`
      UPDATE public.policies SET client_id = ${policy.client_id}, carrier_id = ${policy.carrier_id},
        policy_number = ${policy.policy_number}, line_of_business = ${policy.line_of_business},
        effective_date = ${policy.effective_date}, expiration_date = ${policy.expiration_date},
        premium = ${policy.premium}, status = ${policy.status}, notes = ${policy.notes || null}
      WHERE id = ${id} AND broker_id = ${brokerId} RETURNING id
    `;
    if (rows.length === 0) return { message: 'Policy not found in your account.' };
  } catch {
    return { message: 'The policy could not be updated. Check the information and try again.' };
  }
  revalidatePolicyPaths(policy.client_id, id);
  return { message: 'Policy updated.' };
}

export async function deletePolicy(
  _previousState: PolicyActionState,
  formData: FormData,
): Promise<PolicyActionState> {
  const brokerId = await requireBrokerId();
  const id = formData.get('id');
  if (typeof id !== 'string' || !isUuid(id)) return { message: 'This policy link is not valid. Refresh the page and try again.' };
  const rows = await sql`DELETE FROM public.policies WHERE id = ${id} AND broker_id = ${brokerId} RETURNING client_id`;
  if (rows.length === 0) return { message: 'Policy not found in your account.' };
  revalidatePolicyPaths(String(rows[0].client_id), id);
  redirect('/policies');
}

function revalidatePolicyPaths(clientId: string, policyId: string) {
  revalidatePath('/policies'); revalidatePath('/clients'); revalidatePath('/dashboard');
  revalidatePath('/renewals'); revalidatePath(`/client/${clientId}`); revalidatePath(`/policies/${policyId}`);
}
