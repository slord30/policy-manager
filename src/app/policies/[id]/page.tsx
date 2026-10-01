export default function PolicyDetailPage() {
  const policy = {
    policyNumber: 'AUTO-123456',
    client: 'John Smith',
    carrier: 'Example Insurance',
    lineOfBusiness: 'Auto',
    effectiveDate: '01/01/2026',
    expirationDate: '01/01/2027',
    premium: '$1,200.00',
    paymentFrequency: 'Monthly',
    paymentStatus: 'Current',
    coverageStatus: 'Active',
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Policy Details</h1>
        <p className="mt-2 text-gray-600">
          Policy #{policy.policyNumber}
        </p>
      </div>

      <section className="mb-8 rounded-lg border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {policy.carrier}
            </h2>
            <p className="text-gray-600">
              {policy.lineOfBusiness}
            </p>
          </div>

          <div className="rounded-full border px-4 py-2">
            {policy.coverageStatus}
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Policy Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Client</h3>
            <p>{policy.client}</p>
          </div>

          <div>
            <h3 className="font-medium">Carrier</h3>
            <p>{policy.carrier}</p>
          </div>

          <div>
            <h3 className="font-medium">Policy Number</h3>
            <p>{policy.policyNumber}</p>
          </div>

          <div>
            <h3 className="font-medium">Line of Business</h3>
            <p>{policy.lineOfBusiness}</p>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Coverage Dates
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-medium">Effective Date</h3>
            <p>{policy.effectiveDate}</p>
          </div>

          <div>
            <h3 className="font-medium">Expiration Date</h3>
            <p>{policy.expirationDate}</p>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Premium & Payment
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-medium">Premium</h3>
            <p>{policy.premium}</p>
          </div>

          <div>
            <h3 className="font-medium">Payment Frequency</h3>
            <p>{policy.paymentFrequency}</p>
          </div>

          <div>
            <h3 className="font-medium">Payment Status</h3>
            <p>{policy.paymentStatus}</p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Coverage Status
        </h2>

        <div>
          <h3 className="font-medium">Current Status</h3>
          <p>{policy.coverageStatus}</p>
        </div>
      </section>
    </main>
  );
}   