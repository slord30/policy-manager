export default function ClientDetailPage() {
  const client = {
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, Roosevelt, UT 84066',
    notes: 'Long-term client with multiple active policies.',
  };

  const policies = [
    {
      policyNumber: 'AUTO-123456',
      carrier: 'Example Insurance',
      lineOfBusiness: 'Auto',
      effectiveDate: '01/01/2026',
      expirationDate: '01/01/2027',
      status: 'Active',
    },
    {
      policyNumber: 'HOME-789012',
      carrier: 'Example Insurance',
      lineOfBusiness: 'Home',
      effectiveDate: '06/01/2025',
      expirationDate: '06/01/2026',
      status: 'Expired',
    },
  ];

  const activePolicies = policies.filter(
    (policy) => policy.status === 'Active'
  );

  const historicalPolicies = policies.filter(
    (policy) => policy.status !== 'Active'
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">Client Details</h1>

      <section className="mb-10 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">Client Information</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Full Name</h3>
            <p>{client.fullName}</p>
          </div>

          <div>
            <h3 className="font-medium">Email</h3>
            <p>{client.email}</p>
          </div>

          <div>
            <h3 className="font-medium">Phone</h3>
            <p>{client.phone}</p>
          </div>

          <div>
            <h3 className="font-medium">Address</h3>
            <p>{client.address}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-medium">Notes</h3>
            <p>{client.notes}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Insurance Policies</h2>

        <div className="mb-8">
          <h3 className="mb-4 text-xl font-semibold">Active Policies</h3>

          {activePolicies.length > 0 ? (
            <div className="space-y-4">
              {activePolicies.map((policy) => (
                <div key={policy.policyNumber} className="rounded-lg border p-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium">Policy Number</h4>
                      <p>{policy.policyNumber}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Carrier</h4>
                      <p>{policy.carrier}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Line of Business</h4>
                      <p>{policy.lineOfBusiness}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Effective Date</h4>
                      <p>{policy.effectiveDate}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Expiration Date</h4>
                      <p>{policy.expirationDate}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Status</h4>
                      <p>{policy.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No active policies.</p>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">Historical Policies</h3>

          {historicalPolicies.length > 0 ? (
            <div className="space-y-4">
              {historicalPolicies.map((policy) => (
                <div key={policy.policyNumber} className="rounded-lg border p-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="font-medium">Policy Number</h4>
                      <p>{policy.policyNumber}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Carrier</h4>
                      <p>{policy.carrier}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Line of Business</h4>
                      <p>{policy.lineOfBusiness}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Effective Date</h4>
                      <p>{policy.effectiveDate}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Expiration Date</h4>
                      <p>{policy.expirationDate}</p>
                    </div>

                    <div>
                      <h4 className="font-medium">Status</h4>
                      <p>{policy.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No historical policies.</p>
          )}
        </div>
      </section>
    </main>
  );
}
