// src/app/dashboard/page.tsx
import StatCard from '@/components/StatCard';
import { getDashboardMetrics, getUpcomingRenewals } from './actions';

// Declare the type structure matching your SQL select columns
interface UpcomingRenewalPolicy {
  id: string;
  client: string;
  carrier: string;
  policyNum: string;
  date: string;
  premium: string;
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  
  // Cast the database array to your structural interface block
  const upcomingRenewals = (await getUpcomingRenewals()) as UpcomingRenewalPolicy[];

  return (
    <div className="space-y-8">
      {/* Upper Dashboard Heading Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-text-main uppercase">
          OVERVIEW DASHBOARD
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Aggregated client portfolio metrics running directly on your Neon database instance.
        </p>
      </div>

      {/* Grid of Live StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Clients" 
          value={metrics.totalClients} 
          description="Total independent broker accounts tracked" 
          iconColor="text-primary"
        />
        <StatCard 
          title="Active Policies" 
          value={metrics.activePolicies} 
          description="Live coverage instances across networks" 
          iconColor="text-blue-400"
        />
        <StatCard 
          title="Expiring (30 Days)" 
          value={metrics.expiring30Days} 
          description="High-priority upcoming renewals" 
          iconColor="text-amber-400"
        />
        <StatCard 
          title="Projected Commissions" 
          value={metrics.estimatedCommissions} 
          description="Estimated 15% value of pending renewals" 
          iconColor="text-emerald-400"
        />
      </div>

      {/* Main Structural Feed Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Database Expiration Feed */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-border bg-slate-900/20">
              <h3 className="text-sm font-bold tracking-wider text-text-main uppercase">
                CRITICAL UPCOMING RENEWALS
              </h3>
            </div>
            <div className="divide-y divide-border">
              {upcomingRenewals.length === 0 ? (
                <div className="p-8 text-center text-sm text-text-muted">
                  🎉 No policies are expiring within the next 30 days!
                </div>
              ) : (
                upcomingRenewals.map((policy) => (
                  <div key={policy.id} className="p-4 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-text-main">{policy.client}</p>
                      <div className="flex gap-2 text-xs text-text-muted mt-0.5">
                        <span className="uppercase tracking-wider font-medium text-primary">{policy.carrier}</span>
                        <span>•</span>
                        <span>#{policy.policyNum}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-400 font-mono">{policy.date}</p>
                      <p className="text-xs text-text-muted mt-0.5">{policy.premium} PREMIUM</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* System Utility Sidebar */}
        <div className="bg-surface border border-border p-6 rounded-xl h-fit">
          <h4 className="text-xs font-bold tracking-widest text-text-main uppercase mb-2">
            Quick Actions
          </h4>
          <p className="text-xs text-text-muted mb-4">
            Missed policies mean lost commission statements. Use filters to evaluate carrier distribution models.
          </p>
          <div className="space-y-2">
            <div className="p-2.5 bg-background rounded-md border border-border text-xs text-text-muted font-medium hover:border-primary transition-colors cursor-pointer">
              📊 Export Current Spreadsheet View
            </div>
            <div className="p-2.5 bg-background rounded-md border border-border text-xs text-text-muted font-medium hover:border-primary transition-colors cursor-pointer">
              🔍 Run Batch Expiration Audit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
