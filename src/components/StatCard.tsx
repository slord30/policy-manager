import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  href?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  description,
  href,
  iconColor = 'text-primary',
}: StatCardProps) {
  const card = (
    <div className="h-full rounded-xl border border-border bg-surface p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-text-muted uppercase">
          {title}
        </span>
        <div className={`h-2 w-2 rounded-full ${iconColor} bg-current`} />
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-text-main">
          {value}
        </span>
      </div>

      <p className="mt-1 text-xs text-text-muted">{description}</p>
    </div>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      href={href}
      className="group block rounded-xl transition-colors hover:[&>div]:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      {card}
    </Link>
  );
}