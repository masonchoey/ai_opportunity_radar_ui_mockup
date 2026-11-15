import { CheckCircle2, CircleDot, Eye, XCircle } from "lucide-react";
import type { Confidence, Priority, Status } from "@/data/types";
import { getPriority } from "@/lib/opportunity";
import { cn } from "@/lib/utils";

export const priorityStyles: Record<Priority, { pill: string; dot: string; text: string }> = {
  High: { pill: "bg-teal-50 text-teal-800 border-teal-200", dot: "bg-teal-600", text: "text-teal-700" },
  Medium: { pill: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500", text: "text-amber-700" },
  Low: { pill: "bg-slate-100 text-slate-700 border-slate-200", dot: "bg-slate-400", text: "text-slate-600" },
};

/** Score + priority label. Priority is always written out, never color alone. */
export function ScoreBadge({ score, size = "sm", className }: { score: number; size?: "sm" | "lg"; className?: string }) {
  const priority = getPriority(score);
  const s = priorityStyles[priority];
  if (size === "lg") {
    return (
      <div
        className={cn("inline-flex items-center gap-3 rounded-lg border px-4 py-2.5", s.pill, className)}
        aria-label={`Score ${score}, ${priority} priority`}
      >
        <span className="text-3xl font-bold tabular-nums leading-none">{score}</span>
        <span className="flex flex-col text-xs leading-tight">
          <span className="font-semibold">{priority}</span>
          <span className="opacity-80">priority</span>
        </span>
      </div>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        s.pill,
        className,
      )}
      aria-label={`Score ${score}, ${priority} priority`}
    >
      <span className="font-semibold tabular-nums">{score}</span>
      <span className="opacity-50">·</span>
      <span>{priority}</span>
    </span>
  );
}

const statusStyles: Record<Status, { cls: string; Icon: typeof CircleDot }> = {
  New: { cls: "bg-sky-50 text-sky-800 border-sky-200", Icon: CircleDot },
  Reviewed: { cls: "bg-slate-100 text-slate-700 border-slate-200", Icon: Eye },
  "In HubSpot": { cls: "bg-green-50 text-green-800 border-green-200", Icon: CheckCircle2 },
  Dismissed: { cls: "bg-white text-slate-500 border-slate-200", Icon: XCircle },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { cls, Icon } = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        cls,
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {status}
    </span>
  );
}

const confidenceStyles: Record<Confidence, string> = {
  Verified: "bg-teal-50 text-teal-800 border-teal-200",
  Likely: "bg-amber-50 text-amber-800 border-amber-200",
  Unverified: "bg-slate-100 text-slate-600 border-slate-200",
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        confidenceStyles[confidence],
      )}
    >
      {confidence}
    </span>
  );
}
