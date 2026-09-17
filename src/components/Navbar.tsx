export default function Navbar() {
  return (
    <nav className="w-full bg-surface border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo Identity */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary tracking-tight">PolicyManager</span>
          <span className="text-sm text-text-muted">📋</span>
        </div>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-6">
          <a href="#" className="text-xs uppercase tracking-wider font-semibold border-b-2 border-primary pb-1 text-text-main">
            Dashboard
          </a>
          <a href="#" className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-main transition-colors pb-1">
            Clients
          </a>
          <a href="#" className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-main transition-colors pb-1">
            Policies
          </a>
          <a href="#" className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-main transition-colors pb-1">
            Renewals
          </a>
        </div>

        {/* Action Button */}
        <div>
          <button className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-xs cursor-pointer">
            Add New Policy
          </button>
        </div>
      </div>
    </nav>
  );
}
