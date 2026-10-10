// src/components/StatCard.tsx

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  iconColor?: string;
}

export default function StatCard({ title, value, description, iconColor = "text-primary" }: StatCardProps) {
  return (
    <div className="bg-surface border border-border p-6 rounded-xl shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-text-muted uppercase">
          {title}
        </span>
        <div className={`h-2 w-2 rounded-full ${iconColor} bg-current`} />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-text-main tracking-tight">
          {value}
        </span>
      </div>
      <p className="mt-1 text-xs text-text-muted">
        {description}
      </p>
    </div>
  );
}
