export interface Remaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  overdue: boolean;
  urgency: "critical" | "hot" | "warn" | "ok";
  label: string;
}

export function remainingFrom(endIso: string, now = Date.now()): Remaining {
  const totalMs = new Date(endIso).getTime() - now;
  const overdue = totalMs <= 0;
  const abs = Math.abs(totalMs);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1_000);
  const hoursLeft = totalMs / 3_600_000;
  const urgency: Remaining["urgency"] = overdue
    ? "critical"
    : hoursLeft < 6
      ? "critical"
      : hoursLeft < 24
        ? "hot"
        : hoursLeft < 72
          ? "warn"
          : "ok";
  const label = overdue
    ? "ENDED"
    : days > 0
      ? `${days}d ${hours}h`
      : `${hours}h ${minutes}m`;
  return { totalMs, days, hours, minutes, seconds, overdue, urgency, label };
}

export function relativeTime(iso: string, now = Date.now()) {
  const diff = now - new Date(iso).getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function hoursFromNow(hours: number, now = Date.now()) {
  return new Date(now + hours * 3_600_000).toISOString();
}

export function hoursAgo(hours: number, now = Date.now()) {
  return new Date(now - hours * 3_600_000).toISOString();
}
