import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDownWideNarrow, Search, SearchX, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge, StatusBadge } from "@/components/badges";
import { useOpportunities } from "@/context/OpportunityContext";
import { getPriority } from "@/lib/opportunity";

const ALL = "all";
const COUNTIES = ["Hillsborough", "Pinellas", "Orange", "Miami-Dade", "Broward", "Palm Beach", "Duval"];
const TYPES = ["Renovation", "New construction", "Relocation", "Expansion", "Government bid"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["New", "Reviewed", "In HubSpot", "Dismissed"];

type SortKey = "score" | "date";

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[160px]" aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{`All ${placeholder.toLowerCase()}`}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function OpportunitiesPage() {
  const { opportunities } = useOpportunities();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [county, setCounty] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("score");

  const hasFilters = query !== "" || [county, type, priority, status].some((v) => v !== ALL);

  const clearFilters = () => {
    setQuery("");
    setCounty(ALL);
    setType(ALL);
    setPriority(ALL);
    setStatus(ALL);
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities
      .filter((o) => !q || o.company.toLowerCase().includes(q) || o.city.toLowerCase().includes(q))
      .filter((o) => county === ALL || o.county === county)
      .filter((o) => type === ALL || o.projectType === type)
      .filter((o) => priority === ALL || getPriority(o.score) === priority)
      .filter((o) => status === ALL || o.status === status)
      .sort((a, b) => (sort === "score" ? b.score - a.score : b.detectedAt.localeCompare(a.detectedAt)));
  }, [opportunities, query, county, type, priority, status, sort]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Research each lead, then push the good ones to HubSpot.
        </p>
      </div>

      <Card className="p-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company or city"
              className="pl-9"
              aria-label="Search company or city"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <FilterSelect value={county} onChange={setCounty} placeholder="Counties" options={COUNTIES} />
            <FilterSelect value={type} onChange={setType} placeholder="Project types" options={TYPES} />
            <FilterSelect value={priority} onChange={setPriority} placeholder="Priorities" options={PRIORITIES} />
            <FilterSelect value={status} onChange={setStatus} placeholder="Statuses" options={STATUSES} />
          </div>
          <Button variant="ghost" onClick={clearFilters} disabled={!hasFilters} className="self-start lg:ml-1 lg:self-auto">
            <X /> Clear filters
          </Button>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{rows.length}</span> of {opportunities.length}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <ArrowDownWideNarrow className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Sort by</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-8 w-[200px]" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="score">Score (high to low)</SelectItem>
              <SelectItem value="date">Date detected (newest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
              <SearchX className="h-5 w-5 text-muted-foreground" />
            </span>
            <p className="mt-4 font-medium">No opportunities match these filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a broader search or remove a filter.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Project type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="hidden lg:table-cell">Timeline</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow
                  key={o.id}
                  onClick={() => navigate(`/opportunities/${o.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/opportunities/${o.id}`)}
                  tabIndex={0}
                  className={`cursor-pointer focus-visible:bg-muted/60 focus-visible:outline-none ${o.status === "Dismissed" ? "text-muted-foreground" : ""}`}
                >
                  <TableCell className="min-w-[180px] pl-4">
                    <div className="font-medium text-foreground">{o.company}</div>
                    <div className="text-xs text-muted-foreground">{o.industry}</div>
                  </TableCell>
                  <TableCell>
                    <div>{o.city}</div>
                    <div className="text-xs text-muted-foreground">{o.county} County</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{o.projectType}</TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums">
                    {o.sqft.toLocaleString("en-US")} <span className="text-xs text-muted-foreground">sq ft</span>
                  </TableCell>
                  <TableCell className="hidden max-w-[200px] text-sm lg:table-cell">{o.timeline}</TableCell>
                  <TableCell>
                    <ScoreBadge score={o.score} />
                  </TableCell>
                  <TableCell className="pr-4">
                    <StatusBadge status={o.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
