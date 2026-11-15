import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CalendarRange,
  CheckCircle2,
  Download,
  ExternalLink,
  Factory,
  FileCheck2,
  Landmark,
  Mail,
  MapPin,
  Megaphone,
  Newspaper,
  Phone,
  Ruler,
  ScrollText,
  Send,
  UserSearch,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfidenceBadge, ScoreBadge, StatusBadge, priorityStyles } from "@/components/badges";
import { useOpportunities } from "@/context/OpportunityContext";
import { downloadCsv, formatDate, formatSqft, getPriority } from "@/lib/opportunity";
import type { Rating, SourceType } from "@/data/types";
import { cn } from "@/lib/utils";

const sourceIcons: Record<SourceType, LucideIcon> = {
  Permit: FileCheck2,
  "Notice of commencement": ScrollText,
  "Government bid": Landmark,
  "Press release": Megaphone,
  News: Newspaper,
  "Business filing": Building2,
};

const ratingLevel: Record<Rating, number> = { Strong: 3, Moderate: 2, Weak: 1 };

function RatingMeter({ rating }: { rating: Rating }) {
  const level = ratingLevel[rating];
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span key={i} className={cn("h-2 w-5 rounded-sm", i <= level ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
      <span className="w-16 text-xs font-medium">{rating}</span>
    </div>
  );
}

function Fact({ Icon, label, value }: { Icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function OpportunityDetailPage() {
  const { id = "" } = useParams();
  const { getById, setStatus } = useOpportunities();
  const o = getById(id);

  if (!o) {
    return (
      <div className="py-24 text-center">
        <p className="font-medium">Opportunity not found</p>
        <Link to="/opportunities" className="mt-2 inline-block text-sm text-primary hover:underline">
          Back to opportunities
        </Link>
      </div>
    );
  }

  const priority = getPriority(o.score);
  const inHubSpot = o.status === "In HubSpot";
  const dismissed = o.status === "Dismissed";

  const push = () => {
    setStatus(o.id, "In HubSpot");
    toast.success("Pushed to HubSpot", {
      description: `${o.company} was created as a company record with ${o.contacts.length} contact${o.contacts.length === 1 ? "" : "s"}.`,
    });
  };

  const dismiss = () => {
    const previous = o.status;
    setStatus(o.id, "Dismissed");
    toast("Opportunity dismissed", {
      description: o.company,
      action: { label: "Undo", onClick: () => setStatus(o.id, previous) },
    });
  };

  const restore = () => {
    setStatus(o.id, "Reviewed");
    toast("Opportunity restored", { description: o.company });
  };

  return (
    <div className="space-y-6">
      <Link
        to="/opportunities"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to opportunities
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-5">
            <ScoreBadge score={o.score} size="lg" className="hidden sm:inline-flex" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{o.company}</h1>
                <StatusBadge status={o.status} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Factory className="h-4 w-4" /> {o.industry}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {o.city}, {o.county} County
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> {o.projectType}
                </span>
              </div>
              <ScoreBadge score={o.score} size="lg" className="mt-4 sm:hidden" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {inHubSpot ? (
              <>
                <Button disabled variant="outline" className="border-green-200 bg-green-50 text-green-800 disabled:opacity-100">
                  <CheckCircle2 /> In HubSpot
                </Button>
                <Button asChild variant="link" className="px-2">
                  <a href="#">
                    View in HubSpot <ExternalLink />
                  </a>
                </Button>
              </>
            ) : (
              <Button onClick={push}>
                <Send /> Push to HubSpot
              </Button>
            )}
            {!inHubSpot &&
              (dismissed ? (
                <Button variant="outline" onClick={restore}>
                  Restore
                </Button>
              ) : (
                <Button variant="outline" onClick={dismiss}>
                  <XCircle /> Dismiss
                </Button>
              ))}
            <Button variant="ghost" onClick={() => downloadCsv(o)}>
              <Download /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm leading-relaxed text-foreground/90">{o.description}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Fact Icon={MapPin} label="Location" value={`${o.city}, ${o.county} County`} />
                <Fact Icon={Ruler} label="Size" value={formatSqft(o.sqft)} />
                <Fact Icon={CalendarRange} label="Timeline" value={o.timeline} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why this was flagged</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative ml-1.5 border-l border-border">
                {o.whyFlagged.map((s, i) => (
                  <li key={i} className="relative pb-5 pl-6 last:pb-0">
                    <span
                      className={cn(
                        "absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white",
                        i === o.whyFlagged.length - 1 ? "bg-primary" : "bg-slate-300",
                      )}
                    />
                    <p className="text-xs font-medium text-muted-foreground">{formatDate(s.date)}</p>
                    <p className="mt-0.5 text-sm">{s.signal}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <span className={cn("text-4xl font-bold tabular-nums", priorityStyles[priority].text)}>{o.score}</span>
                <div>
                  <p className="text-sm font-medium">{priority} priority</p>
                  <p className="text-sm text-muted-foreground">{o.scoreSummary}</p>
                </div>
              </div>
              <ul className="divide-y rounded-md border">
                {o.scoreFactors.map((f) => (
                  <li key={f.factor} className="flex flex-col gap-1.5 p-3 sm:flex-row sm:items-center sm:gap-4">
                    <p className="w-40 shrink-0 text-sm font-medium">{f.factor}</p>
                    <RatingMeter rating={f.rating} />
                    <p className="text-sm text-muted-foreground">{f.explanation}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/90">{o.companyOverview}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decision-makers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {o.contacts.length === 0 ? (
                <div className="flex flex-col items-center rounded-md border border-dashed px-4 py-8 text-center">
                  <UserSearch className="h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No decision-makers found yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Contacts appear here as filings and announcements name them.
                  </p>
                </div>
              ) : (
                o.contacts.map((c) => (
                  <div key={c.name} className="rounded-md border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.title}</p>
                      </div>
                      <ConfidenceBadge confidence={c.confidence} />
                    </div>
                    {(c.email || c.phone) && (
                      <div className="mt-2 space-y-1 text-sm">
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-primary hover:underline">
                            <Mail className="h-3.5 w-3.5" /> {c.email}
                          </a>
                        )}
                        {c.phone && (
                          <p className="flex items-center gap-2 text-foreground/80">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {c.phone}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {o.sources.map((s) => {
                  const Icon = sourceIcons[s.type];
                  return (
                    <li key={s.label}>
                      <a
                        href={s.url}
                        className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/60"
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm group-hover:text-primary">{s.label}</span>
                          <span className="block text-xs text-muted-foreground">{s.type}</span>
                        </span>
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
