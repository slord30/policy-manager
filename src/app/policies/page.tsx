'use client';

import { useState } from 'react';

// Define the Policy interface in English
interface Policy {
  id: number;
  policyNumber: string;
  clientName: string;
  carrier: string;
  lineOfBusiness: string;
  premium: number;
  startDate: string;
  endDate: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 1,
      policyNumber: 'POL-2026-001',
      clientName: 'Juan Pérez',
      carrier: 'Pacífico',
      lineOfBusiness: 'Automotive',
      premium: 1200,
      startDate: '2026-01-10',
      endDate: '2027-01-10',
    },
  ]);

  const [form, setForm] = useState({
    policyNumber: '',
    clientName: '',
    carrier: 'Pacífico',
    lineOfBusiness: '',
    premium: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyNumber || !form.clientName) return;

    const newPolicy: Policy = {
      id: Date.now(),
      policyNumber: form.policyNumber,
      clientName: form.clientName,
      carrier: form.carrier,
      lineOfBusiness: form.lineOfBusiness,
      premium: Number(form.premium) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    setPolicies([...policies, newPolicy]);
    setForm({
      policyNumber: '',
      clientName: '',
      carrier: 'Pacífico',
      lineOfBusiness: '',
      premium: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Policy Management</h1>

      {/* Policy Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Policy Number</label>
          <input
            type="text"
            value={form.policyNumber}
            onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="e.g. POL-2026-002"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Client Name</label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="e.g. Maria Gomez"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Insurance Carrier</label>
          <select
            value={form.carrier}
            onChange={(e) => setForm({ ...form, carrier: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="Pacífico">Pacífico</option>
            <option value="Rímac">Rímac</option>
            <option value="Mapfre">Mapfre</option>
            <option value="La Positiva">La Positiva</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Line of Business</label>
          <input
            type="text"
            value={form.lineOfBusiness}
            onChange={(e) => setForm({ ...form, lineOfBusiness: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="e.g. Automotive, Health, Life"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Premium</label>
          <input
            type="number"
            value={form.premium}
            onChange={(e) => setForm({ ...form, premium: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register Policy
          </button>
        </div>
      </form>

      {/* Policies List Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">Registered Policies</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Policy No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Line of Business</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {policies.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.policyNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.clientName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.carrier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.lineOfBusiness}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${p.premium}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{p.startDate} to {p.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}