import {
  DashboardStats,
  ConstellationNode,
  ThreatClassification,
} from '../types';

import { getScanHistory } from './scanHistoryService';

export async function getDashboardStats(): Promise<DashboardStats> {
  const history = getScanHistory();

  const totalScans = history.length;

  const threatsDetected = history.filter(
    (scan) =>
      scan.classification === 'PHISHING' ||
      scan.classification === 'SCAM' ||
      scan.classification === 'MALWARE'
  ).length;

  const safeResults = history.filter(
    (scan) => scan.classification === 'SAFE'
  ).length;

  const suspiciousResults = history.filter(
    (scan) => scan.classification === 'SUSPICIOUS'
  ).length;

  const urlsAnalyzed = history.filter(
    (scan) => scan.type === 'URL'
  ).length;

  const ipLookups = history.filter(
    (scan) => scan.type === 'IP'
  ).length;

  const recentActivity = history
    .slice(0, 10)
    .map((scan) => ({
      id: scan.id,
      type: scan.type,
      target: scan.target,
      classification: scan.classification,
      riskScore: scan.riskScore,
      timeAgo: getTimeAgo(scan.timestamp),
    }));

  return {
    totalScans,
    threatsDetected,
    safeResults,
    suspiciousResults,
    urlsAnalyzed,
    ipLookups,
    recentActivity,
  };
}

export async function getConstellationNodes(): Promise<ConstellationNode[]> {
  const history = getScanHistory();

  return history.slice(0, 30).map((scan, index) => {
    const classification: ThreatClassification = scan.classification;

    return {
      id: scan.id,

      x: 10 + ((index * 37) % 80),
      y: 15 + ((index * 53) % 70),

      vx: 0,
      vy: 0,

      radius:
        classification === 'PHISHING' ||
        classification === 'SCAM' ||
        classification === 'MALWARE'
          ? 10
          : classification === 'SUSPICIOUS'
          ? 8
          : 6,

      type: scan.type,

      target: scan.target,

      classification,

      riskScore: scan.riskScore,

      timestamp: new Date(scan.timestamp).toLocaleTimeString(),
    };
  });
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 10) {
    return 'Just now';
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}