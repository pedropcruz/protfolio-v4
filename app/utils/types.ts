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

export interface EstimateResponse {
  type: "ESTIMATE" | "REFUSAL";
  invoiceId?: string;
  date?: string;
  totalCost?: number;
  totalHours?: number;
  feasibility?: string;
  breakdown?: Array<{ item: string; hours: number; cost: number }>;
  message: string;
}
