export type ProjectType = "Renovation" | "New construction" | "Relocation" | "Expansion" | "Government bid";
export type Status = "New" | "Reviewed" | "In HubSpot" | "Dismissed";
export type Rating = "Strong" | "Moderate" | "Weak";
export type ScoreFactorName = "Project size" | "Timing" | "Furniture likelihood" | "Territory fit";
export type Confidence = "Verified" | "Likely" | "Unverified";
export type SourceType =
  | "Permit"
  | "Notice of commencement"
  | "Government bid"
  | "Press release"
  | "News"
  | "Business filing";

export interface Opportunity {
  id: string;
  company: string;
  industry: string;
  companyOverview: string;
  city: string;
  county: string;
  projectType: ProjectType;
  sqft: number;
  timeline: string;
  description: string;
  score: number;
  status: Status;
  detectedAt: string;
  whyFlagged: { date: string; signal: string }[];
  scoreFactors: { factor: ScoreFactorName; rating: Rating; explanation: string }[];
  scoreSummary: string;
  contacts: { name: string; title: string; email?: string; phone?: string; confidence: Confidence }[];
  sources: { label: string; type: SourceType; url: "#" }[];
}

export type Priority = "High" | "Medium" | "Low";
