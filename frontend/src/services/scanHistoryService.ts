import { ThreatClassification } from '../types';

export interface ScanHistoryItem {
  id: string;
  type: 'MESSAGE' | 'URL' | 'IP';
  target: string;
  classification: ThreatClassification;
  riskScore: number;
  timestamp: number;
}

const STORAGE_KEY = 'rakshak_scan_history';

export function recordScan(scan: ScanHistoryItem): void {
  try {
    const existing = getScanHistory();

    const updated = [
      scan,
      ...existing,
    ].slice(0, 100);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save scan history:', error);
  }
}

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load scan history:', error);
    return [];
  }
}

export function clearScanHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}