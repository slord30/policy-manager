'use client';

import { useState } from 'react';

// Define the Client type
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function ClientsPage() {
  // Initial dummy clients list
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 019-2834' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 (555) 048-9126' },
  ]);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Handle form submission to create a new client
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newClient: Client = {
      id: clients.length + 1,
      name,
      email,
      phone: phone || 'N/A',
    };

    setClients([...clients, newClient]);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Client Management</h1>
      
      {/* Create Client Section */}
      <section className="mb-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Client</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g., Alice Johnson" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g., alice@example.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
              placeholder="e.g., +1 555-0199" 
            />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Client
            </button>
          </div>
        </form>
      </section>

      {/* Client List Section */}
      <section className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Client List</h2>
        {clients.length === 0 ? (
          <p className="text-gray-500">No clients registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm text-gray-800">
                    <td className="p-3 font-medium">{client.id}</td>
                    <td className="p-3">{client.name}</td>
                    <td className="p-3">{client.email}</td>
                    <td className="p-3">{client.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}