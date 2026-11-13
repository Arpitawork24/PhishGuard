import React from 'react';
import { IpAnalysisResult } from '../../types';
import { Badge } from '../common/Badge';
import {
  Building,
  Radio,
  MapPin,
  Clock,
  Mail,
  Compass,
  Activity,
  ShieldAlert,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface IPDetailsProps {
  result: IpAnalysisResult;
}

export const IPDetails: React.FC<IPDetailsProps> = ({ result }) => {
  // Helper to format values or return 'Unavailable'
  const displayVal = (val: string | number | undefined | null) => {
    if (val === undefined || val === null || val === '') {
      return <span className="text-slate-400 italic">Unavailable</span>;
    }
    return val;
  };

  const hasCoordinates = result.coordinates && !isNaN(result.coordinates.lat);

  return (
    <div className="space-y-6">
      {/* Header with IP, IPv4/v6 badge, and Classification */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {result.ip}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-mono font-medium">
            {result.ip.includes(':') ? 'IPv6' : 'IPv4'}
          </span>
          {result.anycast && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono font-medium">
              Anycast
            </span>
          )}
          {result.bogon && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono font-medium">
              Bogon
            </span>
          )}
        </div>
        <Badge classification={result.classification} size="md" />
      </div>

      {/* Verified Real API Data Notice */}
      {result.isRealApiData && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-mono">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>REAL IPINFO API RESPONSE DATA</span>
          </span>
          {result.apiNotice && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden sm:inline">
              {result.apiNotice}
            </span>
          )}
        </div>
      )}

      {/* Grid of Real Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Organization / Operator */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <Building size={12} className="text-cyan-500 dark:text-cyan-400" />
            <span>ORGANIZATION / OPERATOR</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white truncate">
            {displayVal(result.organization || result.asName || result.isp)}
          </div>
          {result.isp && result.isp !== result.organization && (
            <div className="text-[10px] text-slate-500 truncate mt-0.5">
              ISP: {result.isp}
            </div>
          )}
        </div>

        {/* Routed ASN & Domain */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <Radio size={12} className="text-purple-500 dark:text-purple-400" />
            <span>ROUTED ASN</span>
          </div>
          <div className="font-semibold font-mono text-slate-900 dark:text-white flex items-center justify-between">
            <span>{displayVal(result.asn)}</span>
            {result.asDomain && (
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 font-mono">
                {result.asDomain}
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
            Host: {displayVal(result.hostname || result.asDomain)}
          </div>
        </div>

        {/* City & Region */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <MapPin size={12} className="text-blue-500 dark:text-blue-400" />
            <span>CITY & REGION</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {displayVal([result.city, result.region].filter(Boolean).join(', '))}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Region: {displayVal(result.region)}
          </div>
        </div>

        {/* Country & Continent */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <Globe size={12} className="text-emerald-500 dark:text-emerald-400" />
            <span>COUNTRY & CONTINENT</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white">
            {displayVal(result.country)}
            {result.countryCode && (
              <span className="ml-1.5 text-xs text-slate-500 font-mono">({result.countryCode})</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
            Continent: {displayVal(result.continent ? `${result.continent} (${result.continentCode})` : undefined)}
          </div>
        </div>

        {/* Postal Code & Timezone */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <Mail size={12} className="text-amber-500 dark:text-amber-400" />
            <span>POSTAL CODE</span>
          </div>
          <div className="font-semibold font-mono text-slate-900 dark:text-white">
            {displayVal(result.postalCode)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Routing zip/postal boundary
          </div>
        </div>

        {/* Timezone */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-500 dark:text-indigo-400" />
            <span>TIMEZONE</span>
          </div>
          <div className="font-semibold font-mono text-slate-900 dark:text-white">
            {displayVal(result.timezone)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Regional local astronomical reference
          </div>
        </div>

        {/* Coordinates */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 sm:col-span-2">
          <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] mb-1 flex items-center gap-1.5">
            <Compass size={12} className="text-cyan-500 dark:text-cyan-400" />
            <span>ROUTING LOCATION COORDINATES</span>
          </div>
          <div className="font-semibold font-mono text-slate-900 dark:text-white">
            {hasCoordinates
              ? `${result.coordinates?.lat.toFixed(4)}°, ${result.coordinates?.lng.toFixed(4)}°`
              : displayVal(undefined)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Centroid of geographic IP block allocation
          </div>
        </div>
      </div>

      {/* Active Threat Badges if any */}
      {result.activeThreats && result.activeThreats.length > 0 && (
        <div className="pt-2">
          <div className="text-xs font-mono uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-2 flex items-center gap-1.5">
            <ShieldAlert size={14} />
            <span>Active Network Threat Indicators ({result.activeThreats.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.activeThreats.map((threat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-mono"
              >
                {threat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Open Ports Observed */}
      {result.openPorts && result.openPorts.length > 0 && (
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Terminal size={13} className="text-slate-400" />
          <span>Observed Standard Egress Ports: </span>
          <span className="text-slate-900 dark:text-white font-semibold">
            {result.openPorts.join(', ')}
          </span>
        </div>
      )}

      {/* Security Recommendation */}
      <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
        <div className="font-mono text-slate-500 dark:text-slate-400 uppercase text-[10px] mb-1">
          Cyber Defense Recommendation
        </div>
        <p className="leading-relaxed">{result.recommendation}</p>
      </div>
    </div>
  );
};
