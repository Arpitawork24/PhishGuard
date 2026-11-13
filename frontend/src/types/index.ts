export type ThreatClassification = 'SAFE' | 'SUSPICIOUS' | 'PHISHING' | 'SCAM' | 'MALWARE';

export interface ThreatIndicator {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  query: string;
  classification: ThreatClassification;
  riskScore: number;
  confidence: number;
  indicators: ThreatIndicator[];
  explanation: string;
  recommendation: string;
  metadata?: {
    languageDetected?: string;
    suspiciousLinksCount?: number;
    urgencyLevel?: 'None' | 'Moderate' | 'High' | 'Severe';
    spoofedBrand?: string;
    senderReputation?: string;
  };
}

export interface UrlAnalysisResult {
  id: string;
  timestamp: string;
  url: string;
  domain: string;
  classification: ThreatClassification;
  riskScore: number;
  sslStatus: 'Valid EV SSL' | 'Self-Signed' | 'Expired' | 'No SSL' | 'Revoked';
  sslIssuer?: string;
  domainAge: string;
  creationDate: string;
  redirects: string[];
  reputation: 'Trusted' | 'Neutral' | 'Suspicious' | 'Malicious Known';
  threatIndicators: ThreatIndicator[];
  ipAddress: string;
  serverLocation: string;
  dnsRecords: { type: string; value: string }[];
  explanation: string;
  recommendation: string;
}

export interface IpAnalysisResult {
  id: string;
  ip: string;
  classification: ThreatClassification;
  riskScore: number;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  timezone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isp?: string;
  organization?: string;
  asn?: string;
  asName?: string;
  asDomain?: string;
  continent?: string;
  continentCode?: string;
  hostname?: string;
  anycast?: boolean;
  bogon?: boolean;
  abuseScore?: number;
  activeThreats: string[];
  openPorts: number[];
  threatType?: string;
  recommendation: string;
  isRealApiData?: boolean;
  apiNotice?: string;
}

export interface DashboardStats {
  totalScans: number;
  threatsDetected: number;
  safeResults: number;
  suspiciousResults: number;
  urlsAnalyzed: number;
  ipLookups: number;
  recentActivity: Array<{
    id: string;
    type: 'MESSAGE' | 'URL' | 'IP';
    target: string;
    classification: ThreatClassification;
    riskScore: number;
    timeAgo: string;
  }>;
}

export interface ConstellationNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'MESSAGE' | 'URL' | 'IP';
  target: string;
  classification: ThreatClassification;
  riskScore: number;
  timestamp: string;
}
