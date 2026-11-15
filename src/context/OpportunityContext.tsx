import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { opportunities as seed } from "@/data/opportunities";
import type { Opportunity, Status } from "@/data/types";

interface OpportunityContextValue {
  opportunities: Opportunity[];
  getById: (id: string) => Opportunity | undefined;
  setStatus: (id: string, status: Status) => void;
}

const OpportunityContext = createContext<OpportunityContextValue | null>(null);

export function OpportunityProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(seed.map((o) => [o.id, o.status])),
  );

  const opportunities = useMemo(() => seed.map((o) => ({ ...o, status: statuses[o.id] })), [statuses]);

  const getById = useCallback((id: string) => opportunities.find((o) => o.id === id), [opportunities]);

  const setStatus = useCallback((id: string, status: Status) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  }, []);

  const value = useMemo(() => ({ opportunities, getById, setStatus }), [opportunities, getById, setStatus]);

  return <OpportunityContext.Provider value={value}>{children}</OpportunityContext.Provider>;
}

export function useOpportunities() {
  const ctx = useContext(OpportunityContext);
  if (!ctx) throw new Error("useOpportunities must be used inside OpportunityProvider");
  return ctx;
}
