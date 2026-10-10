'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';
import { isUuid } from '@/lib/ids';

const clientSchema = z.object({
  full_name: z.string().trim().min(1, 'Enter the client name.').max(150),
  email: z.string().trim().max(255).email('Enter a valid email address.').or(z.literal('')),
  phone: z.string().trim().max(50, 'Phone number must be 50 characters or fewer.'),
  address: z.string().trim().max(1000, 'Address must be 1,000 characters or fewer.'),
  notes: z.string().trim().max(5000, 'Notes must be 5,000 characters or fewer.'),
});

export type ClientActionState = {
  message: string;
  errors?: Partial<Record<'full_name' | 'email' | 'phone' | 'address' | 'notes', string[]>>;
};

export async function createClient(
  _previousState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const brokerId = await requireBrokerId();
  const parsed = clientSchema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    phone: formData.get('phone') ?? '',
    address: formData.get('address') ?? '',
    notes: formData.get('notes') ?? '',
  });

  if (!parsed.success) {
    return {
      message: 'Please correct the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { full_name, email, phone, address, notes } = parsed.data;

  try {
    await sql`
      INSERT INTO public.clients (broker_id, full_name, email, phone, address, notes)
      VALUES (
        ${brokerId}, ${full_name}, ${email ? email.toLowerCase() : null},
        ${phone || null}, ${address || null}, ${notes || null}
      )
    `;
  } catch {
    return { message: 'The client could not be saved. Please check the information and try again.' };
  }

  revalidatePath('/clients');
  revalidatePath('/dashboard');
  return { message: 'Client saved.' };
}

export async function updateClient(
  _previousState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const brokerId = await requireBrokerId();
  const id = formData.get('id');
  if (typeof id !== 'string' || !isUuid(id)) return { message: 'This client link is not valid. Refresh the page and try again.' };
  const parsed = clientSchema.safeParse({
    full_name: formData.get('full_name'), email: formData.get('email'),
    phone: formData.get('phone') ?? '', address: formData.get('address') ?? '', notes: formData.get('notes') ?? '',
  });
  if (!parsed.success) return { message: 'Please correct the highlighted fields.', errors: parsed.error.flatten().fieldErrors };
  const { full_name, email, phone, address, notes } = parsed.data;
  try {
    const rows = await sql`
      UPDATE public.clients SET full_name = ${full_name}, email = ${email ? email.toLowerCase() : null},
        phone = ${phone || null}, address = ${address || null}, notes = ${notes || null}, updated_at = now()
      WHERE id = ${id} AND broker_id = ${brokerId} RETURNING id
    `;
    if (rows.length === 0) return { message: 'Client not found in your account.' };
  } catch {
    return { message: 'The client could not be updated. The email may already be used by another client in your account.' };
  }
  revalidatePath('/clients'); revalidatePath('/dashboard'); revalidatePath(`/client/${id}`);
  return { message: 'Client updated.' };
}

export async function deleteClient(
  _previousState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const brokerId = await requireBrokerId();
  const id = formData.get('id');
  if (typeof id !== 'string' || !isUuid(id)) return { message: 'This client link is not valid. Refresh the page and try again.' };
  const rows = await sql`DELETE FROM public.clients WHERE id = ${id} AND broker_id = ${brokerId} RETURNING id`;
  if (rows.length === 0) return { message: 'Client not found in your account.' };
  revalidatePath('/clients'); revalidatePath('/policies'); revalidatePath('/dashboard'); revalidatePath('/renewals');
  redirect('/clients');
}
