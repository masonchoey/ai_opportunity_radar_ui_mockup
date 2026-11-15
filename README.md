# Opportunity Radar

A clickable prototype of a lead discovery and research dashboard for the sales team of a
Florida office furniture dealer.

## 1. What this is

- **A frontend-only prototype** for a client presentation (Vite + React + TypeScript,
  Tailwind CSS, shadcn/ui, Recharts).
- **Sample data only.** The 20 opportunities in `src/data/opportunities.ts` are hardcoded,
  and every company, person, email (`example.com`), phone number (`555-01xx`) and
  permit/record number is invented.
- There is **no backend, database, API, AI or real HubSpot connection.** "Push to HubSpot"
  and "Dismiss" only update in-memory React state, which resets on page reload.
- Relative dates ("2 days ago", "New this week") are calculated from a fixed demo date of
  **Nov 15, 2026, 6:02 AM** (`DEMO_NOW` in `src/lib/opportunity.ts`), so the demo looks the
  same whenever it's shown.

## 2. Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and production build
```

The app has three views:

| Route | View |
|---|---|
| `/` | Dashboard: stats, charts, high-priority leads, recently discovered |
| `/opportunities` | Filterable, sortable list of all opportunities |
| `/opportunities/:id` | Opportunity detail: project, why it was flagged, lead score, contacts, sources |

## 3. Design decisions

- **HubSpot stays the system of record.** HubSpot remains the CRM and sales pipeline.
  This tool has no pipeline stages, deals, tasks, notes, activity logs, email or user
  management.
- **The tool is a discovery and research layer.** It finds commercial projects likely to
  need office furniture (permits, notices of commencement, government bids, press releases,
  news, business filings), gathers the research, and hands the lead to HubSpot.
- **Every score is explained.** Each lead shows a one-sentence summary plus a
  Strong/Moderate/Weak rating and a plain-language explanation for each factor (project
  size, timing, furniture likelihood, territory fit). Point weights are not shown.
  Priority (High 80+, Medium 60–79, Low <60) is derived from the score, never stored, and
  always shown as text, never by color alone.
- **Every lead links to its original sources.** The "Why this was flagged" timeline and
  the Sources list point back to the permits, filings and announcements behind the lead.
- **Status stops at "In HubSpot."** Statuses are New → Reviewed → In HubSpot (or
  Dismissed). Once a lead is pushed, the work continues in HubSpot.

## 4. How it would connect to the real system

Replace the hardcoded `src/data` module with calls to a **FastAPI** backend backed by
**Postgres**:

| Method | Endpoint | Replaces |
|---|---|---|
| `GET` | `/opportunities` | the `opportunities` array (list, dashboard) |
| `GET` | `/opportunities/:id` | `getById` on the detail page |
| `POST` | `/opportunities/:id/push-to-hubspot` | `setStatus(id, "In HubSpot")` |
| `POST` | `/opportunities/:id/dismiss` | `setStatus(id, "Dismissed")` |

- The `Opportunity` type in `src/data/types.ts` becomes the API contract.
- `OpportunityContext` would call these endpoints (for example with React Query) instead
  of holding local state.
- The **HubSpot sync runs server-side**. The backend creates or updates the HubSpot
  company and contacts and returns the HubSpot record URL for the "View in HubSpot" link.
  No HubSpot credentials ever reach the browser.
- CSV export can stay client-side or move to a `GET /opportunities/:id/export.csv`
  endpoint.
