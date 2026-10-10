'use client';

import { useEffect, useState } from 'react';

export default function DateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  if (!now) {
    return (
      <div
        className="min-w-40 rounded-lg border border-border bg-surface px-4 py-3"
        aria-label="Loading local date and time"
      >
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-border" />
      </div>
    );
  }

  return (
    <div className="min-w-40 rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-sm font-semibold text-text-main">
        {new Intl.DateTimeFormat(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(now)}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        {new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        }).format(now)}
      </p>
    </div>
  );
}