import { NavLink, Outlet } from "react-router-dom";
import { Radar } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/opportunities", label: "Opportunities", end: false },
];

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="container flex h-14 items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Radar className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Opportunity Radar</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <span className="ml-auto hidden rounded-full border border-dashed px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline">
            Sample data
          </span>
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            <span className="font-medium text-foreground">HubSpot connected</span>
            <span className="hidden md:inline">· Last sync 6:02 AM</span>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Outlet />
      </main>
    </div>
  );
}
