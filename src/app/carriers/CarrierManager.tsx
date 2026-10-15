// src/app/carriers/CarrierManager.tsx
'use client';

import { useActionState, type FormEvent } from 'react';
import { createCarrier, deleteCarrier, updateCarrier, type CarrierActionState } from './actions';

const initialState: CarrierActionState = { message: '' };
type Carrier = { id: string; name: string; policy_count: number };

export default function CarrierManager({ carriers }: { carriers: Carrier[] }) {
  const [state, action, pending] = useActionState(createCarrier, initialState);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Carrier Management</h1>
      <p className="mb-6 text-gray-600">This carrier list is shared by all broker accounts.</p>
      
      {/* Add Carrier Section */}
      <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Add Carrier</h2>
        <form action={action} className="flex flex-wrap items-end gap-3">
          <label className="min-w-64 flex-1 text-sm font-medium">
            Carrier Name
            <input 
              name="name" 
              required 
              maxLength={100} 
              className="mt-1 block w-full rounded-md border p-2" 
              placeholder="e.g. Pacific Insurance" 
            />
            {state.errors?.name && <span className="text-red-600">{state.errors.name[0]}</span>}
          </label>
          
          {/* Isolated #1e3a8a Navy Blue color using Tailwind arbitrary hex value */}
          <button 
            disabled={pending} 
            className="rounded-md bg-[#1e3a8a] hover:bg-[#12255c] px-5 py-2 text-white font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-60 cursor-pointer h-10"
          >
            {pending ? 'Adding…' : 'Add Carrier'}
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-600" aria-live="polite">{state.message}</p>
      </section>

      {/* Carriers List Section */}
      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Carriers</h2>
        {carriers.length === 0 ? (
          <p>No carriers have been added.</p>
        ) : (
          <ul className="divide-y">
            {carriers.map((carrier) => (
              <CarrierRow key={carrier.id} carrier={carrier} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function CarrierRow({ carrier }: { carrier: Carrier }) {
  const [editState, editAction, editing] = useActionState(updateCarrier, initialState);
  const [deleteState, deleteAction, deleting] = useActionState(deleteCarrier, initialState);

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete carrier ${carrier.name}? Only carriers with no attached policies can be deleted.`)) {
      event.preventDefault();
    }
  }

  return (
    <li className="py-4">
      {/* Unified flex layout forcing elements to sit side-by-side on desktop (md:flex-row md:items-end) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between w-full">
        
        {/* Left Side: Edit input fields and policy counts */}
        <form action={editAction} className="flex flex-1 flex-wrap items-end gap-3 w-full">
          <input type="hidden" name="id" value={carrier.id} />
          
          <label className="min-w-56 flex-1 text-sm font-medium">
            Carrier
            <input 
              name="name" 
              defaultValue={carrier.name} 
              required 
              maxLength={100} 
              className="mt-1 block w-full rounded-md border p-2 bg-background border-border text-text-main" 
            />
          </label>
          
          <span className="pb-2.5 text-sm text-gray-600 whitespace-nowrap">
            {carrier.policy_count} policies
          </span>
          
          {/* Action Button Container grouping Save and Delete visually on one baseline line */}
          <div className="flex items-center gap-2">
            <button 
              disabled={editing} 
              className="rounded-md border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-gray-700 font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-60 cursor-pointer h-10 whitespace-nowrap"
            >
              {editing ? 'Saving…' : 'Save Name'}
            </button>
          </div>
        </form>

        {/* Right Side: Delete form stacked flush in the parallel flow row */}
        <form action={deleteAction} onSubmit={confirmDelete} className="flex items-end">
          <input type="hidden" name="id" value={carrier.id} />
          <button 
            disabled={deleting || carrier.policy_count > 0} 
            title={carrier.policy_count > 0 ? 'Remove attached policies before deleting this carrier.' : undefined} 
            className="rounded-md border border-red-600 hover:bg-red-600 hover:text-white px-4 py-2 text-red-700 font-semibold text-xs tracking-wider uppercase transition-all disabled:opacity-40 cursor-pointer h-10 whitespace-nowrap"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </form>
      </div>

      {/* Message feedback alerts area */}
      <div className="mt-1 space-y-1">
        {editState.message && <p className="text-sm text-gray-600" aria-live="polite">{editState.message}</p>}
        {deleteState.message && <p className="text-sm text-red-600" aria-live="polite">{deleteState.message}</p>}
      </div>
    </li>
  );
}
