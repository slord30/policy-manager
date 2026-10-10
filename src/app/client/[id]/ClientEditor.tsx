'use client';

import { useActionState, type FormEvent } from 'react';
import { deleteClient, updateClient, type ClientActionState } from '@/app/clients/actions';

const initialState: ClientActionState = { message: '' };

type ClientValues = {
  id: string; full_name: string; email: string | null; phone: string | null;
  address: string | null; notes: string | null;
};

export default function ClientEditor({ client }: { client: ClientValues }) {
  const [updateState, updateAction, updating] = useActionState(updateClient, initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteClient, initialState);
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete ${client.full_name}? This also permanently deletes all policies attached to this client.`)) event.preventDefault();
  }

  return (
    <section className="mb-10 rounded-lg border p-6">
      <h2 className="mb-4 text-2xl font-semibold">Edit Client</h2>
      <form action={updateAction} className="grid gap-4 md:grid-cols-2">
        <input type="hidden" name="id" value={client.id} />
        <Field label="Full Name" name="full_name" value={client.full_name} error={updateState.errors?.full_name?.[0]} required />
        <Field label="Email" name="email" type="email" value={client.email ?? ''} error={updateState.errors?.email?.[0]} />
        <Field label="Phone" name="phone" value={client.phone ?? ''} error={updateState.errors?.phone?.[0]} />
        <Field label="Address" name="address" value={client.address ?? ''} error={updateState.errors?.address?.[0]} />
        <label className="md:col-span-2 text-sm font-medium">Notes
          <textarea name="notes" defaultValue={client.notes ?? ''} maxLength={5000} rows={3} className="mt-1 block w-full rounded-md border p-2" />
          {updateState.errors?.notes && <span className="text-red-600">{updateState.errors.notes[0]}</span>}
        </label>
        <p className="text-sm text-gray-600" aria-live="polite">{updateState.message}</p>
        <button disabled={updating} className="justify-self-end rounded-md bg-blue-600 px-5 py-2 text-white disabled:opacity-60">{updating ? 'Saving…' : 'Save Changes'}</button>
      </form>
      <div className="mt-6 border-t pt-4">
        <form action={deleteAction} onSubmit={confirmDelete}>
          <input type="hidden" name="id" value={client.id} />
          <button disabled={deleting} className="rounded-md border border-red-600 px-4 py-2 text-red-700 disabled:opacity-60">{deleting ? 'Deleting…' : 'Delete Client'}</button>
          <span className="ml-3 text-sm text-gray-600">Deleting a client also deletes their policies.</span>
          <p className="mt-2 text-sm text-red-700" aria-live="polite">{deleteState.message}</p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, value, error, type = 'text', required = false }: { label: string; name: string; value: string; error?: string; type?: string; required?: boolean }) {
  return <label className="text-sm font-medium">{label}
    <input name={name} type={type} defaultValue={value} required={required} className="mt-1 block w-full rounded-md border p-2" />
    {error && <span className="text-red-600">{error}</span>}
  </label>;
}
