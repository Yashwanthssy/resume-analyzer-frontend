export interface Suggestion {
  section: string;
  original: string;
  improved: string;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  matchScore: number;
  summary: string;
  strengths: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  verdict: 'Strong Match' | 'Good Match' | 'Partial Match' | 'Weak Match';
}

export interface HistoryItem {
  id: string;
  fileName: string;
  score: number;
  createdAt: string;
}
