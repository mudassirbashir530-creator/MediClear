import { AnalysisResult, HistoryItem } from "../types";

const STORAGE_KEY = 'mediclear_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const addToHistory = (result: AnalysisResult): void => {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...result,
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      timestamp: Date.now(),
    };
    // Keep the last 50 items to manage storage size
    const updated = [newItem, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
