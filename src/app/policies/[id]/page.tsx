import DetailField from '@/components/DetailField';

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
          <DetailField label="Client" value={policy.client} />
          <DetailField label="Carrier" value={policy.carrier} />
          <DetailField
            label="Policy Number"
            value={policy.policyNumber}
          />
          <DetailField
            label="Line of Business"
            value={policy.lineOfBusiness}
          />
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Coverage Dates
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <DetailField
            label="Effective Date"
            value={policy.effectiveDate}
          />
          <DetailField
            label="Expiration Date"
            value={policy.expirationDate}
          />
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Premium & Payment
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <DetailField label="Premium" value={policy.premium} />
          <DetailField
            label="Payment Frequency"
            value={policy.paymentFrequency}
          />
          <DetailField
            label="Payment Status"
            value={policy.paymentStatus}
          />
        </div>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          Coverage Status
        </h2>

        <DetailField
          label="Current Status"
          value={policy.coverageStatus}
        />
      </section>
    </main>
  );
}