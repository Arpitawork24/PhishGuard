import {
  AnalysisResult,
  UrlAnalysisResult,
  IpAnalysisResult,
  DashboardStats,
  ConstellationNode
} from '../types';

export const SAMPLE_MESSAGES = [
  {
    title: 'Urgent Bank Verification (Phishing)',
    preview: 'URGENT: Your Chase checking account has been locked due to irregular login attempts...',
    text: `URGENT SECURITY NOTICE: Your Chase checking account has been temporarily restricted due to unauthorized login attempts from IP 192.241.20.11 (Moscow, RU).

To restore immediate access and prevent permanent card cancellation, you must verify your identity within 2 hours:
https://chase-security-verify.update-portal-auth.com/login?token=92849204

Do not share this link with anyone. Chase Security Operations Team.`,
  },
  {
    title: 'CEO Wire Transfer Request (Business Scam)',
    preview: 'Hey, are you at your desk? Need you to process an urgent discrete acquisition wire...',
    text: `Hey, are you at your desk right now?

I am currently tied up in an offsite executive board meeting with our M&A advisors. We are closing a confidential acquisition deal before markets close today.

Please prepare an immediate wire transfer of $48,500 to the external escrow account attached. Do not call my cell as I cannot pick up in the boardroom. Email me confirmation as soon as initiated.

Best,
Richard Vance, Chief Executive Officer`,
  },
  {
    title: 'FedEx Delivery Failure (Malware / Credential)',
    preview: 'FedEx Tracking Notice: Parcel #FX-894102 could not be delivered to your address...',
    text: `FedEx Express Notification:
Tracking ID: #US-8941-89240-FX

Your parcel scheduled for delivery on Sept 08 could not be completed due to an invalid delivery fee of $1.85.

To reschedule delivery to your home address and download your shipping label:
https://fedex-parcel-redelivery.us-express-tracking.cc/invoice_label.pdf.exe

Unclaimed parcels will be returned to sender within 24 hours.`,
  },
  {
    title: 'Internal IT System Maintenance (Safe)',
    preview: 'Scheduled maintenance notification for Okta SSO and Internal VPN services this Saturday...',
    text: `Dear Engineering Team,

Please be advised that internal IT Infrastructure will perform scheduled database updates on the Okta SSO identity provider this Saturday from 02:00 UTC to 04:00 UTC.

No action is required on your part. System status can be monitored on our internal dashboard at https://status.internal.phishguard.io.

Regards,
PhishGuard Internal IT Security`,
  },
];

export const MOCK_ANALYSIS_RESULTS: Record<string, AnalysisResult> = {
  phishing_bank: {
    id: 'MSG-8921-PHISH',
    timestamp: 'Just now',
    query: 'URGENT SECURITY NOTICE: Your Chase checking account has been temporarily restricted...',
    classification: 'PHISHING',
    riskScore: 96,
    confidence: 94,
    indicators: [
      {
        id: 'ind-1',
        name: 'Urgency Manipulation',
        severity: 'high',
        description: 'Employs artificial time-limit panic ("verify within 2 hours") to bypass cognitive verification.'
      },
      {
        id: 'ind-2',
        name: 'Credential Harvesting Link',
        severity: 'critical',
        description: 'URL target uses typosquatted domain "update-portal-auth.com" disguised as legitimate Chase portal.'
      },
      {
        id: 'ind-3',
        name: 'Impersonation Pattern',
        severity: 'critical',
        description: 'Spoofs Chase Bank security alerts without verified cryptographic sender signatures (DKIM/SPF failure).'
      },
      {
        id: 'ind-4',
        name: 'Geographic Fear Induction',
        severity: 'medium',
        description: 'References foreign unauthorized login to induce psychological anxiety.'
      }
    ],
    explanation: 'This communication exhibits high-fidelity credential harvesting techniques. The embedded hyperlink directs the victim to a newly registered non-banking domain mimicking financial authentication screens to intercept credentials and 2FA tokens.',
    recommendation: 'DO NOT CLICK LINKS. Quarantine message immediately and report sender to internal SOC. If credentials were entered, revoke account sessions immediately.',
    metadata: {
      languageDetected: 'English (US)',
      suspiciousLinksCount: 1,
      urgencyLevel: 'Severe',
      spoofedBrand: 'JPMorgan Chase & Co.',
      senderReputation: 'Untrusted / New Domain'
    }
  },
  scam_ceo: {
    id: 'MSG-4820-SCAM',
    timestamp: 'Just now',
    query: 'Hey, are you at your desk right now? Need you to process an urgent wire transfer...',
    classification: 'SCAM',
    riskScore: 88,
    confidence: 91,
    indicators: [
      {
        id: 'ind-1',
        name: 'Business Email Compromise (BEC)',
        severity: 'critical',
        description: 'Simulates executive authority to request rapid financial wire transfers bypassing regular approval chains.'
      },
      {
        id: 'ind-2',
        name: 'Communication Channel Isolation',
        severity: 'high',
        description: 'Explicitly requests not calling on the phone ("tied up in boardroom"), isolating the employee from dual-factor verification.'
      },
      {
        id: 'ind-3',
        name: 'Urgent Wire Transfer',
        severity: 'critical',
        description: 'Demands financial transaction of $48,500 under confidentiality pretext.'
      }
    ],
    explanation: 'Classic Business Email Compromise (BEC) scenario. The attacker exploits presumed managerial authority and confidential acquisition pressure to orchestrate fraudulent wire authorization.',
    recommendation: 'HALT ALL TRANSFERS. Verify through out-of-band communication (in-person or corporate phone directory). Alert financial controller immediately.',
    metadata: {
      languageDetected: 'English (US)',
      suspiciousLinksCount: 0,
      urgencyLevel: 'Severe',
      spoofedBrand: 'Internal Executive (CEO)',
      senderReputation: 'Freemail / Lookalike Domain'
    }
  },
  malware_fedex: {
    id: 'MSG-3392-MALW',
    timestamp: 'Just now',
    query: 'FedEx Express Notification: Parcel scheduled for delivery could not be completed...',
    classification: 'MALWARE',
    riskScore: 99,
    confidence: 98,
    indicators: [
      {
        id: 'ind-1',
        name: 'Double File Extension Payload',
        severity: 'critical',
        description: 'Hyperlink points to an executable masquerading as a document: ".pdf.exe" payload dropper.'
      },
      {
        id: 'ind-2',
        name: 'Micro-Payment Fee Bait',
        severity: 'high',
        description: 'Asks for negligible fee ($1.85) to steal credit card details and deploy payload.'
      },
      {
        id: 'ind-3',
        name: 'Logistics Brand Abuse',
        severity: 'high',
        description: 'Brand abuse targeting FedEx logistics systems with spoofed tracking identifiers.'
      }
    ],
    explanation: 'Critical malware delivery vector. The destination payload is an obfuscated Windows executable engineered to execute infostealer Trojans upon opening.',
    recommendation: 'CRITICAL THREAT: Do not open or download attachments. Block destination domain at firewall/DNS resolver and isolate any machine that accessed this link.',
    metadata: {
      languageDetected: 'English (US)',
      suspiciousLinksCount: 1,
      urgencyLevel: 'High',
      spoofedBrand: 'FedEx Express',
      senderReputation: 'Blacklisted C2 Server'
    }
  },
  safe_it: {
    id: 'MSG-1002-SAFE',
    timestamp: 'Just now',
    query: 'Dear Engineering Team, Please be advised that internal IT Infrastructure will perform scheduled...',
    classification: 'SAFE',
    riskScore: 4,
    confidence: 96,
    indicators: [
      {
        id: 'ind-safe-1',
        name: 'DKIM & SPF Authentication Passed',
        severity: 'low',
        description: 'Originating cryptographic headers match corporate domain certificates.'
      },
      {
        id: 'ind-safe-2',
        name: 'No Credential or Financial Demands',
        severity: 'low',
        description: 'Message is informational and does not solicit password resets or money.'
      },
      {
        id: 'ind-safe-3',
        name: 'Internal Domain Resolution',
        severity: 'low',
        description: 'Referenced hyperlinks resolve solely to authenticated corporate intranet hosts.'
      }
    ],
    explanation: 'No threat indicators detected. The message structure adheres to legitimate IT communication standards, carries no social engineering coercion, and directs to validated internal status systems.',
    recommendation: 'Safe to proceed. Standard internal notification requiring no evasive countermeasures.',
    metadata: {
      languageDetected: 'English (US)',
      suspiciousLinksCount: 0,
      urgencyLevel: 'None',
      spoofedBrand: 'None',
      senderReputation: 'Verified Internal Tenant'
    }
  },
  suspicious_invoice: {
    id: 'MSG-7712-SUSP',
    timestamp: 'Just now',
    query: 'Attached is the revised invoice for last months subscription billing. Please review...',
    classification: 'SUSPICIOUS',
    riskScore: 62,
    confidence: 82,
    indicators: [
      {
        id: 'ind-s-1',
        name: 'Unsolicited Invoice Reference',
        severity: 'medium',
        description: 'Sender domain has no prior communication history with this recipient.'
      },
      {
        id: 'ind-s-2',
        name: 'Generic Salutation',
        severity: 'medium',
        description: 'Impersonal greeting characteristic of mass spear-phishing campaigns.'
      }
    ],
    explanation: 'Moderate anomaly indicators. While no explicit malicious payload has detonated, the unverified provenance and billing context warrant cautious validation before opening attachments.',
    recommendation: 'Exercise caution. Contact the sender through verified telephone numbers before interacting with attachments or hyperlinks.',
    metadata: {
      languageDetected: 'English (US)',
      suspiciousLinksCount: 1,
      urgencyLevel: 'Moderate',
      spoofedBrand: 'Unknown Vendor',
      senderReputation: 'Uncategorized'
    }
  }
};

export const SAMPLE_URLS = [
  'https://secure-chase-update.co/login',
  'https://paypal-security-auth.net/verify',
  'https://microsoft-onedrive-download.cc/sharepoint',
  'https://google.com',
  'https://github.com/security'
];

export const MOCK_URL_RESULTS: Record<string, UrlAnalysisResult> = {
  'https://secure-chase-update.co/login': {
    id: 'URL-9921',
    timestamp: 'Just now',
    url: 'https://secure-chase-update.co/login',
    domain: 'secure-chase-update.co',
    classification: 'PHISHING',
    riskScore: 95,
    sslStatus: 'Self-Signed',
    sslIssuer: "Let's Encrypt (Automated/Free)",
    domainAge: '3 days old',
    creationDate: '2026-09-05',
    redirects: [
      'https://secure-chase-update.co/login',
      'https://cdn-auth-relay.org/portal?dest=chase',
      'https://portal-credential-dump.xyz/harvest'
    ],
    reputation: 'Malicious Known',
    threatIndicators: [
      {
        id: 'url-1',
        name: 'Typosquatting & Brand Abuse',
        severity: 'critical',
        description: 'Domain mimics JPMorgan Chase financial brand on an unauthorized top-level domain.'
      },
      {
        id: 'url-2',
        name: 'Ephemeral Domain Age',
        severity: 'high',
        description: 'Domain was registered less than 72 hours ago, typical of disposable attack infrastructure.'
      },
      {
        id: 'url-3',
        name: 'Multi-Hop Obfuscation Redirect',
        severity: 'critical',
        description: 'Undergoes 3 automated HTTP redirects to evade initial perimeter web filters.'
      }
    ],
    ipAddress: '45.143.220.12',
    serverLocation: 'St. Petersburg, Russia',
    dnsRecords: [
      { type: 'A', value: '45.143.220.12' },
      { type: 'NS', value: 'ns1.bulletproof-dns.is' },
      { type: 'MX', value: '0 mail.secure-chase-update.co' }
    ],
    explanation: 'Confirmed high-risk credential harvester. Domain masquerades as online banking authentication while routing submitted credentials through a distributed proxy server.',
    recommendation: 'BLOCK ACCESS IMMEDIATELY. Add domain and IP to corporate edge egress blocklists.'
  },
  'https://google.com': {
    id: 'URL-1001',
    timestamp: 'Just now',
    url: 'https://google.com',
    domain: 'google.com',
    classification: 'SAFE',
    riskScore: 1,
    sslStatus: 'Valid EV SSL',
    sslIssuer: 'Google Trust Services LLC',
    domainAge: '28 years old',
    creationDate: '1997-09-15',
    redirects: ['https://www.google.com/'],
    reputation: 'Trusted',
    threatIndicators: [
      {
        id: 'url-safe-1',
        name: 'Authoritative Enterprise Infrastructure',
        severity: 'low',
        description: 'Globally trusted multi-region infrastructure with verified root certificates.'
      }
    ],
    ipAddress: '142.250.190.46',
    serverLocation: 'Mountain View, California, USA',
    dnsRecords: [
      { type: 'A', value: '142.250.190.46' },
      { type: 'AAAA', value: '2607:f8b0:4005:808::200e' }
    ],
    explanation: 'No security risks detected. Domain has flawless reputation history and enterprise cryptographic validation.',
    recommendation: 'Safe for browsing and standard user interactions.'
  }
};

export const SAMPLE_IPS = [
  '185.220.101.5',
  '45.143.220.12',
  '194.26.29.114',
  '8.8.8.8',
  '1.1.1.1'
];

export const MOCK_IP_RESULTS: Record<string, IpAnalysisResult> = {
  '185.220.101.5': {
    id: 'IP-8821',
    ip: '185.220.101.5',
    classification: 'MALWARE',
    riskScore: 97,
    country: 'Germany',
    countryCode: 'DE',
    region: 'Hesse',
    city: 'Frankfurt am Main',
    coordinates: {
      lat: 50.1109,
      lng: 8.6821
    },
    isp: 'Zwiebelfreunde e.V.',
    organization: 'Tor Exit Relay Network',
    asn: 'AS200651',
    hostname: 'tor-exit-frankfurt.nodes.net',
    abuseScore: 98,
    activeThreats: [
      'Active Tor Exit Node',
      'SSH Credential Brute-Forcing',
      'Distributed Port Scanning',
      'Credential Stuffing Probes'
    ],
    openPorts: [22, 80, 443, 9001, 9050],
    threatType: 'Anonymizer & Attack Relay',
    recommendation: 'BLOCK INBOUND/OUTBOUND. Prevent this address from accessing internal endpoints or API gateways.'
  },
  '45.143.220.12': {
    id: 'IP-4412',
    ip: '45.143.220.12',
    classification: 'PHISHING',
    riskScore: 93,
    country: 'Russia',
    countryCode: 'RU',
    region: 'Saint Petersburg',
    city: 'Saint Petersburg',
    coordinates: {
      lat: 59.9343,
      lng: 30.3351
    },
    isp: 'Megalink Hosting LTD',
    organization: 'Bulletproof Host Network',
    asn: 'AS49505',
    hostname: 'node-host-ru.bulletproof.su',
    abuseScore: 91,
    activeThreats: [
      'Banking Phishing Kits Host',
      'C2 Command Server',
      'Fast-Flux DNS Agent'
    ],
    openPorts: [80, 443, 8080, 8443],
    threatType: 'Phishing Kit Deployment Host',
    recommendation: 'REPUTATION REJECT: Add ASN AS49505 and IP to perimeter firewall threat filters.'
  },
  '8.8.8.8': {
    id: 'IP-1008',
    ip: '8.8.8.8',
    classification: 'SAFE',
    riskScore: 0,
    country: 'United States',
    countryCode: 'US',
    region: 'California',
    city: 'Mountain View',
    coordinates: {
      lat: 37.422,
      lng: -122.0841
    },
    isp: 'Google LLC',
    organization: 'Google Public DNS',
    asn: 'AS15169',
    hostname: 'dns.google',
    abuseScore: 0,
    activeThreats: [],
    openPorts: [53, 443, 853],
    threatType: 'Anycast Recursive Resolver',
    recommendation: 'Safe system infrastructure. Authoritative public recursive DNS resolver.'
  }
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalScans: 48920,
  threatsDetected: 14210,
  safeResults: 28450,
  suspiciousResults: 6260,
  urlsAnalyzed: 18740,
  ipLookups: 12940,
  recentActivity: [
    {
      id: 'act-1',
      type: 'MESSAGE',
      target: 'Urgent Wire Transfer Request (CEO Spoof)',
      classification: 'SCAM',
      riskScore: 88,
      timeAgo: '2m ago'
    },
    {
      id: 'act-2',
      type: 'URL',
      target: 'https://secure-chase-update.co/login',
      classification: 'PHISHING',
      riskScore: 95,
      timeAgo: '7m ago'
    },
    {
      id: 'act-3',
      type: 'IP',
      target: '185.220.101.5 (Tor Exit Node)',
      classification: 'MALWARE',
      riskScore: 97,
      timeAgo: '14m ago'
    },
    {
      id: 'act-4',
      type: 'MESSAGE',
      target: 'Okta SSO Maintenance Notification',
      classification: 'SAFE',
      riskScore: 4,
      timeAgo: '23m ago'
    },
    {
      id: 'act-5',
      type: 'URL',
      target: 'https://github.com/phishguard',
      classification: 'SAFE',
      riskScore: 2,
      timeAgo: '35m ago'
    },
    {
      id: 'act-6',
      type: 'MESSAGE',
      target: 'Unsolicited Subscription Invoice #892',
      classification: 'SUSPICIOUS',
      riskScore: 62,
      timeAgo: '42m ago'
    }
  ]
};

export const MOCK_CONSTELLATION_NODES: ConstellationNode[] = [
  { id: 'c-1', x: 0.22, y: 0.32, vx: 0.15, vy: -0.12, radius: 5.5, type: 'MESSAGE', target: 'Bank Alert Phish', classification: 'PHISHING', riskScore: 96, timestamp: '10:42 AM' },
  { id: 'c-2', x: 0.38, y: 0.22, vx: -0.1, vy: 0.08, radius: 4.5, type: 'URL', target: 'paypaI-verify.cc', classification: 'PHISHING', riskScore: 94, timestamp: '10:38 AM' },
  { id: 'c-3', x: 0.52, y: 0.38, vx: 0.05, vy: -0.07, radius: 6.0, type: 'IP', target: '185.220.101.5', classification: 'MALWARE', riskScore: 98, timestamp: '10:35 AM' },
  { id: 'c-4', x: 0.68, y: 0.26, vx: -0.08, vy: -0.14, radius: 4.0, type: 'MESSAGE', target: 'Internal Memo', classification: 'SAFE', riskScore: 2, timestamp: '10:31 AM' },
  { id: 'c-5', x: 0.78, y: 0.44, vx: 0.12, vy: 0.1, radius: 5.0, type: 'URL', target: 'chase.com', classification: 'SAFE', riskScore: 1, timestamp: '10:27 AM' },
  { id: 'c-6', x: 0.16, y: 0.62, vx: -0.05, vy: 0.15, radius: 5.2, type: 'MESSAGE', target: 'CEO Wire Transfer', classification: 'SCAM', riskScore: 89, timestamp: '10:22 AM' },
  { id: 'c-7', x: 0.31, y: 0.74, vx: 0.14, vy: -0.09, radius: 4.8, type: 'URL', target: 'onedrive-share.tk', classification: 'SUSPICIOUS', riskScore: 68, timestamp: '10:18 AM' },
  { id: 'c-8', x: 0.48, y: 0.65, vx: -0.12, vy: -0.06, radius: 5.8, type: 'IP', target: '45.143.220.12', classification: 'PHISHING', riskScore: 93, timestamp: '10:14 AM' },
  { id: 'c-9', x: 0.64, y: 0.78, vx: 0.08, vy: 0.12, radius: 4.2, type: 'MESSAGE', target: 'FedEx Tracking Notice', classification: 'MALWARE', riskScore: 99, timestamp: '10:09 AM' },
  { id: 'c-10', x: 0.82, y: 0.68, vx: -0.09, vy: -0.11, radius: 4.0, type: 'URL', target: 'google.com', classification: 'SAFE', riskScore: 0, timestamp: '10:02 AM' },
  { id: 'c-11', x: 0.42, y: 0.48, vx: 0.11, vy: 0.04, radius: 7.0, type: 'MESSAGE', target: 'Credential Harvester', classification: 'PHISHING', riskScore: 97, timestamp: '09:55 AM' },
  { id: 'c-12', x: 0.58, y: 0.18, vx: -0.07, vy: 0.13, radius: 4.6, type: 'IP', target: '8.8.8.8', classification: 'SAFE', riskScore: 0, timestamp: '09:48 AM' },
  { id: 'c-13', x: 0.25, y: 0.45, vx: 0.09, vy: -0.1, radius: 4.5, type: 'URL', target: 'crypto-airdrop.xyz', classification: 'SCAM', riskScore: 86, timestamp: '09:40 AM' },
  { id: 'c-14', x: 0.72, y: 0.55, vx: -0.13, vy: 0.07, radius: 5.1, type: 'MESSAGE', target: 'Invoice #84910', classification: 'SUSPICIOUS', riskScore: 64, timestamp: '09:30 AM' },
];
