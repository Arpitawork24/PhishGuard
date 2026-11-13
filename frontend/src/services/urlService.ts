import { UrlAnalysisResult } from '../types';
import { recordScan } from './scanHistoryService';

const API_URL = 'http://127.0.0.1:8000';

export async function analyzeUrl(
  inputUrl: string
): Promise<UrlAnalysisResult> {
  const url = inputUrl.trim();

  if (!url) {
    throw new Error('Please enter a URL');
  }

  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
    }),
  });

  if (!response.ok) {
    throw new Error(`URL analysis failed (${response.status})`);
  }

  const data = await response.json();
  recordScan({
    id: `URL-${Date.now()}`,
    type: 'URL',
    target: url,
    classification:
      data.prediction === 'phishing'
        ? 'PHISHING'
        : data.prediction === 'suspicious'
        ? 'SUSPICIOUS'
        : 'SAFE',
    riskScore: Math.round((data.risk_score ?? 0) * 100),
    timestamp: Date.now(),
  });

  const result: UrlAnalysisResult = {
    id: `URL-${Date.now()}`,
    timestamp: 'Just now',

    url: url,
    domain: extractDomain(url),

    classification:
      data.prediction?.toUpperCase() || 'SUSPICIOUS',

    riskScore: Math.round((data.risk_score ?? 0) * 100),

    sslStatus: data.ssl_status || 'No SSL',
    sslIssuer: data.ssl_issuer || undefined,

    domainAge: data.domain_age || 'Unknown',
    creationDate: data.creation_date || 'Unknown',

    redirects: data.redirects || [url],

    reputation:
      data.prediction === 'phishing'
        ? 'Malicious Known'
        : data.prediction === 'suspicious'
        ? 'Suspicious'
        : 'Trusted',

    threatIndicators: (data.reasons || []).map(
      (reason: string, index: number) => ({
        id: `url-ind-${index}`,
        name: 'Threat Detection',
        severity:
          data.prediction === 'phishing'
            ? 'critical'
            : data.prediction === 'suspicious'
            ? 'high'
            : 'low',
        description: reason,
      })
    ),

    ipAddress: data.ip_address || 'Unknown',
    serverLocation: data.server_location || 'Unknown',

    dnsRecords: data.dns_records || [],

    explanation:
      data.explanation ||
      'URL analysis completed using the RAKSHAK AI phishing detection engine.',

    recommendation:
      data.recommendation ||
      (data.prediction === 'phishing'
        ? 'Do not visit this URL or enter any credentials.'
        : 'Exercise caution before interacting with this URL.'),
  };

  // Save this URL scan to dashboard history
  recordScan({
    id: result.id,
    type: 'URL',
    target: url,
    classification: result.classification,
    riskScore: result.riskScore,
    timestamp: Date.now(),
  });

  return result;
}

function extractDomain(url: string): string {
  try {
    const normalized = url.startsWith('http')
      ? url
      : `https://${url}`;

    return new URL(normalized).hostname;
  } catch {
    return url.split('/')[0];
  }
}