import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Inbox, Send, Sparkles, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/ChartCard";
import { ScoreBadge, StatusBadge } from "@/components/badges";
import { useOpportunities } from "@/context/OpportunityContext";
import { getPriority, isNewThisWeek, relativeDate } from "@/lib/opportunity";
import type { ProjectType } from "@/data/types";

const PROJECT_TYPES: ProjectType[] = ["Renovation", "New construction", "Relocation", "Expansion", "Government bid"];
const COUNTIES = ["Hillsborough", "Pinellas", "Orange", "Miami-Dade", "Broward", "Palm Beach", "Duval"];

function StatCard({ label, value, hint, Icon }: { label: string; value: number; hint: string; Icon: LucideIcon }) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { opportunities } = useOpportunities();
  const navigate = useNavigate();

  const stats = useMemo(
    () => ({
      total: opportunities.length,
      newThisWeek: opportunities.filter(isNewThisWeek).length,
      high: opportunities.filter((o) => getPriority(o.score) === "High").length,
      inHubSpot: opportunities.filter((o) => o.status === "In HubSpot").length,
    }),
    [opportunities],
  );

  const byType = PROJECT_TYPES.map((t) => ({ name: t, count: opportunities.filter((o) => o.projectType === t).length }));
  const byCounty = COUNTIES.map((c) => ({ name: c, count: opportunities.filter((o) => o.county === c).length }));

  const topLeads = [...opportunities]
    .filter((o) => o.status !== "Dismissed")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const recent = [...opportunities].sort((a, b) => b.detectedAt.localeCompare(a.detectedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Commercial projects across Florida that are likely to need office furniture.
          </p>
        </div>
        <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View all opportunities <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total opportunities" value={stats.total} hint="Tracked across 7 counties" Icon={Inbox} />
        <StatCard label="New this week" value={stats.newThisWeek} hint="Detected in the last 7 days" Icon={Sparkles} />
        <StatCard label="High priority" value={stats.high} hint="Score of 80 or higher" Icon={Flame} />
        <StatCard label="Sent to HubSpot" value={stats.inHubSpot} hint="Pushed for sales follow-up" Icon={Send} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Opportunities by project type" description="All tracked opportunities" data={byType} layout="horizontal" />
        <ChartCard title="Opportunities by county" description="All tracked opportunities" data={byCounty} layout="vertical" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>High-priority leads</CardTitle>
            <CardDescription>Top 5 by score, excluding dismissed</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ul className="divide-y">
              {topLeads.map((o) => (
                <li key={o.id}>
                  <button
                    onClick={() => navigate(`/opportunities/${o.id}`)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{o.company}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.city} · {o.projectType}
                      </p>
                    </div>
                    <ScoreBadge score={o.score} />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently discovered</CardTitle>
            <CardDescription>Latest 5 by date detected</CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <ul className="divide-y">
              {recent.map((o) => (
                <li key={o.id}>
                  <button
                    onClick={() => navigate(`/opportunities/${o.id}`)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{o.company}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.city} · {o.projectType}
                      </p>
                    </div>
                    <StatusBadge status={o.status} className="hidden sm:inline-flex" />
                    <span className="w-24 text-right text-xs text-muted-foreground">{relativeDate(o.detectedAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
