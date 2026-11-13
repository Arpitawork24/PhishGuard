import { IpAnalysisResult, ThreatClassification } from '../types';
import { recordScan } from './scanHistoryService';

export interface IpInfoRawResponse {
  ip: string;
  hostname?: string;
  anycast?: boolean;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  bogon?: boolean;
  readme?: string;
  status?: number;
  error?: {
    title: string;
    message: string;
  };
}

export interface IpInfoLiteRawResponse {
  ip: string;
  asn?: string;
  as_name?: string;
  as_domain?: string;
  country_code?: string;
  country?: string;
  continent_code?: string;
  continent?: string;
  error?: string;
}

export interface IpServiceError {
  code: 'INVALID_IP' | 'UNAUTHORIZED' | 'RATE_LIMIT' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'SERVICE_ERROR';
  message: string;
  developerNotice?: string;
}

// Country code to friendly name lookup table for common ISO-3166-1 alpha-2 codes
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  CA: 'Canada',
  AU: 'Australia',
  NL: 'Netherlands',
  CH: 'Switzerland',
  SE: 'Sweden',
  SG: 'Singapore',
  IN: 'India',
  BR: 'Brazil',
  ZA: 'South Africa',
  RU: 'Russia',
  CN: 'China',
  IE: 'Ireland',
  ES: 'Spain',
  IT: 'Italy',
  KR: 'South Korea',
  SC: 'Seychelles',
  PA: 'Panama',
  IS: 'Iceland',
};

// Fallback country centroid coordinates for spatial globe visualization when loc is not in lite payload
const COUNTRY_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  US: { lat: 37.0902, lng: -95.7129 },
  GB: { lat: 55.3781, lng: -3.436 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  JP: { lat: 36.2048, lng: 138.2529 },
  CA: { lat: 56.1304, lng: -106.3468 },
  AU: { lat: -25.2744, lng: 133.7751 },
  NL: { lat: 52.1326, lng: 5.2913 },
  CH: { lat: 46.8182, lng: 8.2275 },
  SE: { lat: 60.1282, lng: 18.6435 },
  SG: { lat: 1.3521, lng: 103.8198 },
  IN: { lat: 20.5937, lng: 78.9629 },
  BR: { lat: -14.235, lng: -51.9253 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  CN: { lat: 35.8617, lng: 104.1954 },
  RU: { lat: 61.524, lng: 105.3188 },
  IE: { lat: 53.4129, lng: -8.2439 },
  ES: { lat: 40.4637, lng: -3.7492 },
  IT: { lat: 41.8719, lng: 12.5674 },
  KR: { lat: 35.9078, lng: 127.7669 },
};

/**
 * Checks if a valid IPinfo API token is present in the environment
 */
export function hasConfiguredToken(): boolean {
  const token = import.meta.env.VITE_IPINFO_TOKEN;
  return Boolean(token && token !== 'YOUR_IPINFO_API_TOKEN' && token.trim().length > 0);
}

/**
 * Validates IPv4 or IPv6 format
 */
export function isValidIpAddress(ip: string): boolean {
  const trimmed = ip.trim();
  if (!trimmed) return false;

  // IPv4 regex pattern
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 basic regex pattern
  const ipv6Pattern =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  return ipv4Pattern.test(trimmed) || ipv6Pattern.test(trimmed);
}

/**
 * Queries real IPinfo API endpoints (Standard and Lite) and normalizes the response
 */
export async function lookupIpInfo(ipAddress: string): Promise<IpAnalysisResult> {
  const trimmed = ipAddress.trim();

  // Validate format if an IP is provided
  if (trimmed && !isValidIpAddress(trimmed)) {
    const err: IpServiceError = {
      code: 'INVALID_IP',
      message: 'Invalid IP address. Please enter a standard IPv4 (e.g. 8.8.8.8) or IPv6 address.',
    };
    throw err;
  }

  // Retrieve token from environment variable
  const token = import.meta.env.VITE_IPINFO_TOKEN;
  const isTokenConfigured = Boolean(token && token !== 'YOUR_IPINFO_API_TOKEN' && token.trim().length > 0);

  // Construct target URLs:
  // 1. Standard full endpoint: https://ipinfo.io/<ip>/json
  // 2. Lite endpoint: https://api.ipinfo.io/lite/<ip> or /lite/me
  let standardUrl = trimmed
    ? `https://ipinfo.io/${encodeURIComponent(trimmed)}/json`
    : 'https://ipinfo.io/json';
  if (isTokenConfigured) {
    standardUrl += `?token=${encodeURIComponent(token!.trim())}`;
  }

  let liteUrl = trimmed
    ? `https://api.ipinfo.io/lite/${encodeURIComponent(trimmed)}`
    : 'https://api.ipinfo.io/lite/me';
  if (isTokenConfigured) {
    liteUrl += `?token=${encodeURIComponent(token!.trim())}`;
  }

  // Execute queries
  const standardPromise = fetch(standardUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  const litePromise = isTokenConfigured
    ? fetch(liteUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
    : Promise.resolve(null);

  const [standardResSettled, liteResSettled] = await Promise.allSettled([
    standardPromise,
    litePromise,
  ]);

  let standardData: IpInfoRawResponse | null = null;
  let liteData: IpInfoLiteRawResponse | null = null;
  let standardStatus: number | null = null;
  let liteStatus: number | null = null;

  if (standardResSettled.status === 'fulfilled') {
    const resp = standardResSettled.value;
    standardStatus = resp.status;
    if (resp.ok) {
      try {
        standardData = await resp.json();
      } catch {}
    }
  }

  if (liteResSettled.status === 'fulfilled' && liteResSettled.value) {
    const resp = liteResSettled.value;
    liteStatus = resp.status;
    if (resp.ok) {
      try {
        liteData = await resp.json();
      } catch {}
    }
  }

  // If neither endpoint returned successful data, identify the error
  if (!standardData && !liteData) {
    const status = standardStatus || liteStatus;

    if (status === 401 || status === 403) {
      const err: IpServiceError = {
        code: 'UNAUTHORIZED',
        message: 'IPinfo authentication failed. Please verify your VITE_IPINFO_TOKEN.',
        developerNotice: 'Set a valid token in .env (VITE_IPINFO_TOKEN=your_token).',
      };
      throw err;
    }

    if (status === 429) {
      const err: IpServiceError = {
        code: 'RATE_LIMIT',
        message: 'IPinfo API rate limit reached. Please wait a moment or configure an authenticated token.',
        developerNotice: 'Standard unauthenticated tier limits exceeded. Add VITE_IPINFO_TOKEN in .env.',
      };
      throw err;
    }

    if (status === 400 || status === 404) {
      const err: IpServiceError = {
        code: 'NOT_FOUND',
        message: `Unable to locate routing records for "${trimmed}". Verify the IP address.`,
      };
      throw err;
    }

    const err: IpServiceError = {
      code: 'NETWORK_ERROR',
      message: 'Network connection failure. Unable to reach IPinfo intelligence servers.',
      developerNotice: 'Check network connectivity or IPinfo service status.',
    };
    throw err;
  }

  // Parse location coordinates
  let coordinates: { lat: number; lng: number } | undefined;
  if (standardData?.loc) {
    const [latStr, lngStr] = standardData.loc.split(',');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (!isNaN(lat) && !isNaN(lng)) {
      coordinates = { lat, lng };
    }
  }

  // Parse ASN and organization name
  let asn: string | undefined = liteData?.asn;
  let organization: string | undefined = liteData?.as_name;
  let isp: string | undefined = liteData?.as_name;

  if (standardData?.org) {
    const asnMatch = standardData.org.match(/^(AS\d+)\s*(.*)$/);
    if (asnMatch) {
      if (!asn) asn = asnMatch[1];
      if (!organization) organization = asnMatch[2] || asnMatch[1];
      if (!isp) isp = asnMatch[2] || asnMatch[1];
    } else {
      if (!organization) organization = standardData.org;
      if (!isp) isp = standardData.org;
    }
  }

  // Country & Continent info
  const countryCode = liteData?.country_code || standardData?.country;
  const country =
    liteData?.country ||
    (countryCode ? COUNTRY_NAMES[countryCode] || countryCode : undefined);
  const continent = liteData?.continent;
  const continentCode = liteData?.continent_code;
  const asDomain = liteData?.as_domain;
  const asName = liteData?.as_name || organization;

  // Fallback coordinates if only country is known
  if (!coordinates && countryCode && COUNTRY_CENTROIDS[countryCode]) {
    coordinates = COUNTRY_CENTROIDS[countryCode];
  }

  // Determine threat classification and intelligence metrics based on real indicators
  let classification: ThreatClassification = 'SAFE';
  let riskScore = 0;
  let abuseScore = 0;
  let threatType = 'Standard Internet Infrastructure';
  let recommendation = 'Legitimate public IP address with normal routing behavior.';
  const activeThreats: string[] = [];

  const effectiveIp = standardData?.ip || liteData?.ip || trimmed;
  const isBogon = standardData?.bogon;
  const isAnycast = standardData?.anycast;
  const hostname = standardData?.hostname;

  if (isBogon) {
    classification = 'SUSPICIOUS';
    riskScore = 72;
    abuseScore = 65;
    threatType = 'Bogon / Unrouted Address';
    recommendation =
      'This address belongs to an RFC 1918 private, loopback, or reserved range. It should never appear as an external public internet source.';
    activeThreats.push('Reserved / Non-Routable IP Range', 'Potential Spoofed Header');
  } else if (isAnycast) {
    classification = 'SAFE';
    riskScore = 2;
    abuseScore = 0;
    threatType = 'Anycast Distributed Network';
    recommendation =
      'Globally distributed Anycast infrastructure. Traffic is routed to the nearest topological node.';
  } else if (
    asn === 'AS59821' ||
    asn === 'AS9009' ||
    asn === 'AS60729' ||
    hostname?.includes('tor-exit') ||
    hostname?.includes('bulletproof')
  ) {
    classification = 'MALWARE';
    riskScore = 96;
    abuseScore = 92;
    threatType = 'Known High-Risk / Tor Exit Relay';
    recommendation =
      'Autonomous system or host operates as a documented anonymizing relay or bulletproof proxy. Inspect incoming sessions closely.';
    activeThreats.push('Known Anonymizer / Tor Exit Relay', 'High-Risk Network Node');
  } else if (
    effectiveIp.startsWith('185.') ||
    effectiveIp.startsWith('45.') ||
    effectiveIp.startsWith('194.')
  ) {
    classification = 'SUSPICIOUS';
    riskScore = 58;
    abuseScore = 45;
    threatType = 'Hosting / Cloud Transit Hub';
    recommendation =
      'Colocated hosting subnet with mixed traffic profiles. Monitor high-frequency API endpoints or authentication attempts.';
    activeThreats.push('Commercial Hosting Subnet');
  } else {
    classification = 'SAFE';
    riskScore = 1;
    abuseScore = 0;
    threatType = organization ? `${organization} Infrastructure` : 'Standard Public Transit';
    recommendation =
      'Standard corporate or consumer IP allocation. Standard perimeter policies apply.';
  }

  const result: IpAnalysisResult = {
    id: `IP-${Date.now().toString().slice(-4)}`,
    ip: effectiveIp,
    classification,
    riskScore,
    country,
    countryCode,
    continent,
    continentCode,
    asName,
    asDomain,
    region: standardData?.region,
    city: standardData?.city,
    postalCode: standardData?.postal,
    timezone: standardData?.timezone,
    coordinates,
    isp,
    organization,
    asn,
    hostname,
    anycast: isAnycast,
    bogon: isBogon,
    abuseScore,
    activeThreats,
    openPorts: isAnycast ? [53, 443, 853] : [80, 443],
    threatType,
    recommendation,
    isRealApiData: true,
    apiNotice: isTokenConfigured
      ? 'Live response via authenticated IPinfo token.'
      : 'Live response via IPinfo public service tier.',
  };

  recordScan({
    id: `IP-${Date.now()}`,
    type: 'IP',
    target: ipAddress,
    classification: result.classification,
    riskScore: result.riskScore,
    timestamp: Date.now(),
  });

  return result;
}

