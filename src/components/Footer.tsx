export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-border mt-auto px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-text-muted space-y-2 md:space-y-0">
        <div>
          <span>&copy; {currentYear} <strong>PolicyManager CRM</strong>. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-text-main transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-text-main transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-text-main transition-colors">Support Portal</a>
        </div>
      </div>
    </footer>
  );
}
