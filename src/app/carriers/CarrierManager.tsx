'use client';

import { useActionState, type FormEvent } from 'react';
import { createCarrier, deleteCarrier, updateCarrier, type CarrierActionState } from './actions';

const initialState: CarrierActionState = { message: '' };
type Carrier = { id: string; name: string; policy_count: number };

export default function CarrierManager({ carriers }: { carriers: Carrier[] }) {
  const [state, action, pending] = useActionState(createCarrier, initialState);
  return <main className="mx-auto max-w-5xl p-8">
    <h1 className="mb-2 text-3xl font-bold">Carrier Management</h1>
    <p className="mb-6 text-gray-600">This carrier list is shared by all broker accounts.</p>
    <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Add Carrier</h2>
      <form action={action} className="flex flex-wrap items-end gap-3">
        <label className="min-w-64 flex-1 text-sm font-medium">Carrier Name<input name="name" required maxLength={100} className="mt-1 block w-full rounded-md border p-2" placeholder="e.g. Pacific Insurance" />{state.errors?.name && <span className="text-red-600">{state.errors.name[0]}</span>}</label>
        <button disabled={pending} className="rounded-md bg-blue-600 px-5 py-2 text-white disabled:opacity-60">{pending ? 'Adding…' : 'Add Carrier'}</button>
      </form>
      <p className="mt-2 text-sm text-gray-600" aria-live="polite">{state.message}</p>
    </section>
    <section className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Carriers</h2>
      {carriers.length === 0 ? <p>No carriers have been added.</p> : <ul className="divide-y">
        {carriers.map((carrier) => <CarrierRow key={carrier.id} carrier={carrier} />)}
      </ul>}
    </section>
  </main>;
}

function CarrierRow({ carrier }: { carrier: Carrier }) {
  const [editState, editAction, editing] = useActionState(updateCarrier, initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteCarrier, initialState);
  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete carrier ${carrier.name}? Only carriers with no attached policies can be deleted.`)) event.preventDefault();
  }
  return <li className="flex flex-col gap-3 py-4 md:flex-row md:items-start md:justify-between">
    <form action={editAction} className="flex flex-1 flex-wrap items-end gap-3">
      <input type="hidden" name="id" value={carrier.id} />
      <label className="min-w-56 flex-1 text-sm font-medium">Carrier<input name="name" defaultValue={carrier.name} required maxLength={100} className="mt-1 block w-full rounded-md border p-2" /></label>
      <span className="pb-2 text-sm text-gray-600">{carrier.policy_count} policies</span>
      <button disabled={editing} className="rounded-md border px-4 py-2 disabled:opacity-60">{editing ? 'Saving…' : 'Save Name'}</button>
      <p className="w-full text-sm text-gray-600" aria-live="polite">{editState.message}</p>
    </form>
    <form action={deleteAction} onSubmit={confirmDelete}>
      <input type="hidden" name="id" value={carrier.id} />
      <button disabled={deleting || carrier.policy_count > 0} title={carrier.policy_count > 0 ? 'Remove attached policies before deleting this carrier.' : undefined} className="rounded-md border border-red-600 px-4 py-2 text-red-700 disabled:opacity-40">{deleting ? 'Deleting…' : 'Delete'}</button>
      <p className="text-sm text-red-700" aria-live="polite">{deleteState.message}</p>
    </form>
  </li>;
}
