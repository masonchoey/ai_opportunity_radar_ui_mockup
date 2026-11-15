import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { OpportunityProvider } from "@/context/OpportunityContext";
import { DashboardPage } from "@/pages/DashboardPage";
import { OpportunitiesPage } from "@/pages/OpportunitiesPage";
import { OpportunityDetailPage } from "@/pages/OpportunityDetailPage";

export function App() {
  return (
    <OpportunityProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </OpportunityProvider>
  );
}
