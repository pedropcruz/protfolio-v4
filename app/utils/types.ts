export interface Project {
  id: string;
  title: string;
  tags: string[];
  description: {
    en: string;
    pt: string;
  };
  details: {
    challenge: { en: string; pt: string };
    solution: { en: string; pt: string };
    stack: Array<{ name: string; reason: { en: string; pt: string } }>;
    images: string[];
  };
}

export interface BlogPost {
  id: string;
  category: string;
  date: string;
  title: { en: string; pt: string };
  content: { en: string; pt: string };
  analytics: {
    views: number;
    reads: number;
    avgTime: string;
    shares: number;
  };
}
export interface ContentProject {
  id: string;
  title: string;
  tags: string[];
  description: string;
  stem?: string;
  details: {
    challenge: string;
    solution: string;
    stack: Array<{ name: string; reason: string }>;
    images: string[];
  };
  [key: string]: unknown;
}

export interface ContentBlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  stem?: string;
  analytics?: {
    views: number;
    reads: number;
    avgTime: string;
    shares: number;
  };
  [key: string]: unknown;
}

export interface EstimateRequest {
  name: string;
  email: string;
  projectType: 'fixed' | 'retainer';
  velocity: 'standard' | 'express';
  services: string[];
  problem: string;
  currentSolution?: string;
  expectedOutcome: string;
  budgetRange?: string;
  monthlyHours?: string;
  locale: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentGiven: boolean;
}

export interface EstimateBreakdownItem {
  item: string;
  hoursMin: number;
  hoursMax: number;
  costMin: number;
  costMax: number;
}

export interface EstimateResponse {
  invoiceId: string;
  date: string;
  totalCostMin: number;
  totalCostMax: number;
  totalHoursMin: number;
  totalHoursMax: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  feasibility: string;
  breakdown: EstimateBreakdownItem[];
  expressSurcharge: boolean;
  message: string;
}
