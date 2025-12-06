export interface AnalysisResult {
  summary: string;
  detailedSummary: string;
  urduTranslation: string;
  nextSteps: string[];
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
}