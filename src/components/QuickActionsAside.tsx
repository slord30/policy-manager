import Link from 'next/link';

const actions = [
  { label: 'Add New Client', href: '/clients#new-client' },
  { label: 'Add New Policy', href: '/policies#new-policy' },
  { label: 'Add New Carrier', href: '/carriers#new-carrier' },
];

export default function QuickActionsAside() {
  return (
    <aside className="h-fit rounded-xl border border-border bg-surface p-4 md:sticky md:top-24 md:w-56 md:shrink-0">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-text-main">
        Quick Actions
      </h2>

      <nav aria-label="Quick actions">
        <ul className="space-y-2">
          {actions.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="block rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-text-main hover:border-primary"
              >
                {action.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}