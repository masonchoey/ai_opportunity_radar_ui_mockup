import type { Opportunity, Priority } from "@/data/types";

// Fixed "today" so relative dates stay stable for the demo (matches the 6:02 AM sync badge).
export const DEMO_NOW = new Date("2026-11-15T06:02:00");

export function getPriority(score: number): Priority {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

const dayMs = 24 * 60 * 60 * 1000;

function parseDate(iso: string) {
  // Treat date-only strings as local dates, not UTC.
  return iso.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
}

export function daysAgo(iso: string, now = DEMO_NOW) {
  const d = parseDate(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((startOfToday.getTime() - d.getTime()) / dayMs);
}

export function relativeDate(iso: string) {
  const n = daysAgo(iso);
  if (n <= 0) return "Today";
  if (n === 1) return "Yesterday";
  if (n < 7) return `${n} days ago`;
  const w = Math.floor(n / 7);
  return w === 1 ? "1 week ago" : `${w} weeks ago`;
}

export function isNewThisWeek(o: Opportunity) {
  return daysAgo(o.detectedAt) < 7;
}

export function formatDate(iso: string) {
  return parseDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatSqft(n: number) {
  return `${n.toLocaleString("en-US")} sq ft`;
}

function csvCell(v: string | number | undefined) {
  const s = v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function opportunityToCsv(o: Opportunity) {
  const rows: (string | number | undefined)[][] = [
    ["Field", "Value"],
    ["Company", o.company],
    ["Industry", o.industry],
    ["City", o.city],
    ["County", o.county],
    ["Project type", o.projectType],
    ["Size (sq ft)", o.sqft],
    ["Timeline", o.timeline],
    ["Score", o.score],
    ["Priority", getPriority(o.score)],
    ["Status", o.status],
    ["Detected", o.detectedAt],
    ["Description", o.description],
    ["Score summary", o.scoreSummary],
    [],
    ["Contact name", "Title", "Email", "Phone", "Confidence"],
    ...o.contacts.map((c) => [c.name, c.title, c.email, c.phone, c.confidence]),
  ];
  return rows.map((r) => r.map(csvCell).join(",")).join("\n");
}

export function downloadCsv(o: Opportunity) {
  const blob = new Blob([opportunityToCsv(o)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${o.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
