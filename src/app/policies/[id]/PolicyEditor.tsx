'use client';

import { useActionState, type FormEvent } from 'react';
import { deletePolicy, updatePolicy, type PolicyActionState } from '@/app/policies/actions';

const initialState: PolicyActionState = { message: '' };
type PolicyValues = {
  id: string; client_id: string; carrier_id: string; policy_number: string;
  line_of_business: string | null; effective_date: string | null; expiration_date: string;
  premium: string | number; status: string; notes: string | null;
};
type Option = { id: string; name: string };

export default function PolicyEditor({ policy, clients, carriers }: { policy: PolicyValues; clients: Option[]; carriers: Option[] }) {
  const [state, action, pending] = useActionState(updatePolicy, initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deletePolicy, initialState);
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete policy ${policy.policy_number}? This cannot be undone.`)) event.preventDefault();
  }
  return (
    <section className="mt-8 rounded-lg border p-6">
      <h2 className="mb-4 text-2xl font-semibold">Edit Policy</h2>
      <form action={action} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="id" value={policy.id} />
        <label className="text-sm font-medium">Client<select name="client_id" defaultValue={policy.client_id} required className="mt-1 block w-full rounded-md border p-2">{clients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-sm font-medium">Carrier<select name="carrier_id" defaultValue={policy.carrier_id} required className="mt-1 block w-full rounded-md border p-2">{carriers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <Field label="Policy Number" name="policy_number" value={policy.policy_number} required />
        <Field label="Line of Business" name="line_of_business" value={policy.line_of_business ?? ''} required />
        <Field label="Effective Date" name="effective_date" type="date" value={dateValue(policy.effective_date)} required />
        <Field label="Expiration Date" name="expiration_date" type="date" value={dateValue(policy.expiration_date)} required />
        <Field label="Premium (USD)" name="premium" type="number" value={String(policy.premium)} required />
        <label className="text-sm font-medium">Status<select name="status" defaultValue={policy.status} className="mt-1 block w-full rounded-md border p-2"><option>ACTIVE</option><option>PENDING</option><option>EXPIRED</option><option>CANCELLED</option></select></label>
        <label className="md:col-span-2 text-sm font-medium">Notes<textarea name="notes" defaultValue={policy.notes ?? ''} maxLength={5000} rows={3} className="mt-1 block w-full rounded-md border p-2" /></label>
        <p className="text-sm text-gray-600" aria-live="polite">{state.message}</p>
        <button disabled={pending} className="justify-self-end rounded-md bg-blue-600 px-5 py-2 text-white disabled:opacity-60">{pending ? 'Saving…' : 'Save Changes'}</button>
      </form>
      <form action={deleteAction} onSubmit={confirmDelete} className="mt-6 border-t pt-4">
        <input type="hidden" name="id" value={policy.id} />
        <button disabled={deleting} className="rounded-md border border-red-600 px-4 py-2 text-red-700 disabled:opacity-60">{deleting ? 'Deleting…' : 'Delete Policy'}</button>
        <p className="mt-2 text-sm text-red-700" aria-live="polite">{deleteState.message}</p>
      </form>
    </section>
  );
}

function dateValue(value: string | null) { return value ? value.slice(0, 10) : ''; }
function Field({ label, name, value, type = 'text', required = false }: { label: string; name: string; value: string; type?: string; required?: boolean }) {
  return <label className="text-sm font-medium">{label}<input name={name} type={type} defaultValue={value} required={required} maxLength={100} className="mt-1 block w-full rounded-md border p-2" /></label>;
}
