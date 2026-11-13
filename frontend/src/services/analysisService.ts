import { AnalysisResult, ThreatIndicator } from '../types';
import { recordScan } from './scanHistoryService';

interface BackendEmailResult {
  prediction: 'phishing' | 'spam' | 'safe';
  risk_score: number;
  suspicious_urls: string[];
  reasons: string[];
  ml_confidence?: number;
  urls_found?: number;
  suspicious_keywords?: string[];
}

const API_BASE_URL = 'http://127.0.0.1:8000';

function getClassification(
  prediction: BackendEmailResult['prediction']
): AnalysisResult['classification'] {
  switch (prediction) {
    case 'phishing':
      return 'PHISHING';
    case 'spam':
      return 'SCAM';
    default:
      return 'SAFE';
  }
}

function getSeverity(riskScore: number): ThreatIndicator['severity'] {
  if (riskScore >= 0.85) return 'critical';
  if (riskScore >= 0.65) return 'high';
  if (riskScore >= 0.35) return 'medium';
  return 'low';
}

function buildIndicators(data: BackendEmailResult): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  const severity = getSeverity(data.risk_score);

  data.reasons.forEach((reason, index) => {
    indicators.push({
      id: `backend-reason-${index}`,
      name: reason.startsWith('ML Model')
        ? 'Machine Learning Detection'
        : reason.includes('URL')
        ? 'Suspicious URL Detection'
        : reason.includes('keyword')
        ? 'Phishing Keyword Detection'
        : 'Threat Indicator',
      severity,
      description: reason,
    });
  });

  if (data.suspicious_urls?.length) {
    data.suspicious_urls.forEach((url, index) => {
      indicators.push({
        id: `suspicious-url-${index}`,
        name: 'Suspicious URL',
        severity: 'critical',
        description: url,
      });
    });
  }

  return indicators;
}

function buildRecommendation(
  classification: AnalysisResult['classification']
): string {
  switch (classification) {
    case 'PHISHING':
      return 'Do not click links, provide credentials, or respond to the message. Verify the sender through an independent trusted channel.';
    case 'SCAM':
      return 'Treat this message with caution. Do not send money or sensitive information until the request is independently verified.';
    case 'SAFE':
      return 'No significant phishing indicators were detected. Continue following normal security practices.';
    default:
      return 'Exercise caution and independently verify the message before taking sensitive actions.';
  }
}

export async function analyzeMessage(
  message: string
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_text: message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend analysis failed: ${response.status}`);
  }

  const data: BackendEmailResult = await response.json();

  const classification = getClassification(data.prediction);
  recordScan({
    id: `MESSAGE-${Date.now()}`,
    type: 'MESSAGE',
    target: message.slice(0, 80),
    classification,
    riskScore: Math.round(data.risk_score * 100),
    timestamp: Date.now(),
  });

  return {
    id: `RAKSHAK-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    query: message.slice(0, 120) + (message.length > 120 ? '...' : ''),
    classification,
    riskScore: Math.round(data.risk_score * 100),
    confidence: Math.round((data.ml_confidence ?? data.risk_score) * 100),
    indicators: buildIndicators(data),
    explanation:
      data.reasons.length > 0
        ? data.reasons.join(' ')
        : 'Analysis completed by the RAKSHAK AI detection engine.',
    recommendation: buildRecommendation(classification),
    metadata: {
      suspiciousLinksCount: data.urls_found ?? data.suspicious_urls?.length ?? 0,
      urgencyLevel:
        data.risk_score >= 0.85
          ? 'Severe'
          : data.risk_score >= 0.65
          ? 'High'
          : data.risk_score >= 0.35
          ? 'Moderate'
          : 'None',
    },
  };
}