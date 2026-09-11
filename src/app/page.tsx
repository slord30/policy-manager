export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-main">Welcome back, Sarah!</h1>
        <p className="text-sm text-text-muted mt-1">Here is a summary of your insurance portfolio metrics.</p>
      </div>

      {/* Summary Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-xs">
          <h3 className="text-xs uppercase tracking-wider text-text-muted font-medium">Active Clients</h3>
          <p className="text-3xl font-bold text-text-main mt-1">1,248</p>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="px-2 py-0.5 rounded-sm font-medium text-success bg-success/10">+3%</span>
            <span className="text-text-muted">vs last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-xs">
          <h3 className="text-xs uppercase tracking-wider text-text-muted font-medium">Total Policies</h3>
          <p className="text-3xl font-bold text-text-main mt-1">3,892</p>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="text-text-muted">Across 5 Carriers</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface p-6 rounded-xl border border-border shadow-xs">
          <h3 className="text-xs uppercase tracking-wider text-text-muted font-medium">Renewals Due (30 Days)</h3>
          <p className="text-3xl font-bold text-text-main mt-1">47</p>
          <div className="flex items-center space-x-2 mt-2 text-xs">
            <span className="px-2 py-0.5 rounded-sm font-medium text-warning bg-warning/10">Action Required</span>
          </div>
        </div>

      </div>
    </main>
  );
}
