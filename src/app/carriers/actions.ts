'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';
import { isUuid } from '@/lib/ids';

export type CarrierActionState = { message: string; errors?: { name?: string[] } };
const carrierSchema = z.object({ name: z.string().trim().min(1, 'Enter a carrier name.').max(100, 'Carrier name must be 100 characters or fewer.') });

export async function createCarrier(_state: CarrierActionState, formData: FormData): Promise<CarrierActionState> {
  await requireBrokerId();
  const parsed = carrierSchema.safeParse({ name: formData.get('name') });
  if (!parsed.success) return { message: 'Please correct the highlighted field.', errors: parsed.error.flatten().fieldErrors };
  try {
    await sql`INSERT INTO public.carriers (name) VALUES (${parsed.data.name})`;
  } catch {
    return { message: 'Could not add carrier. That name may already exist.' };
  }
  revalidateCarrierPages();
  return { message: 'Carrier added.' };
}

export async function updateCarrier(_state: CarrierActionState, formData: FormData): Promise<CarrierActionState> {
  await requireBrokerId();
  const id = formData.get('id');
  if (typeof id !== 'string' || !isUuid(id)) return { message: 'Carrier not found. Refresh and try again.' };
  const parsed = carrierSchema.safeParse({ name: formData.get('name') });
  if (!parsed.success) return { message: 'Please correct the highlighted field.', errors: parsed.error.flatten().fieldErrors };
  try {
    const rows = await sql`UPDATE public.carriers SET name = ${parsed.data.name}, updated_at = now() WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return { message: 'Carrier not found.' };
  } catch {
    return { message: 'Could not update carrier. That name may already exist.' };
  }
  revalidateCarrierPages();
  return { message: 'Carrier updated.' };
}

export async function deleteCarrier(_state: CarrierActionState, formData: FormData): Promise<CarrierActionState> {
  await requireBrokerId();
  const id = formData.get('id');
  if (typeof id !== 'string' || !isUuid(id)) return { message: 'Carrier not found. Refresh and try again.' };
  const inUse = await sql`SELECT 1 FROM public.policies WHERE carrier_id = ${id} LIMIT 1`;
  if (inUse.length > 0) return { message: 'This carrier is attached to policies and cannot be deleted.' };
  try {
    const rows = await sql`DELETE FROM public.carriers WHERE id = ${id} RETURNING id`;
    if (rows.length === 0) return { message: 'Carrier not found.' };
  } catch {
    return { message: 'Carrier is in use and cannot be deleted.' };
  }
  revalidateCarrierPages();
  redirect('/carriers');
}

function revalidateCarrierPages() {
  revalidatePath('/carriers'); revalidatePath('/policies'); revalidatePath('/dashboard');
}
