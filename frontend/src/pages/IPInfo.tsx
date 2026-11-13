import React, { useState } from 'react';
import { lookupIpInfo, hasConfiguredToken, IpServiceError } from '../services/ipInfoService';
import { IpAnalysisResult } from '../types';
import { IPInput } from '../components/ip/IPInput';
import { IPInfoResult } from '../components/ip/IPInfoResult';
import { IPLoadingState } from '../components/ip/IPLoadingState';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import {
  Server,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Info,
  ExternalLink
} from 'lucide-react';

export const IPInfo: React.FC = () => {
  const [inputIp, setInputIp] = useState('8.8.8.8');
  const [lookingUp, setLookingUp] = useState(false);
  const [result, setResult] = useState<IpAnalysisResult | null>(null);
  const [error, setError] = useState<IpServiceError | null>(null);

  const hasToken = hasConfiguredToken();

  const handleLookup = async (targetIpOverride?: string) => {
    const target = targetIpOverride !== undefined ? targetIpOverride : inputIp;
    setLookingUp(true);
    setError(null);
    setResult(null);

    try {
      const res = await lookupIpInfo(target);
      setResult(res);
    } catch (err: unknown) {
      const serviceErr = err as IpServiceError;
      if (serviceErr && serviceErr.code) {
        setError(serviceErr);
      } else {
        setError({
          code: 'SERVICE_ERROR',
          message: 'Unable to retrieve IP intelligence.',
        });
      }
    } finally {
      setLookingUp(false);
    }
  };

  const handlePresetSelect = (ip: string) => {
    setInputIp(ip);
    setError(null);
    handleLookup(ip);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 relative">
      <div className="ambient-gradient absolute top-0 inset-x-0 h-[600px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page Header matching Section 12 requirements */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-mono mb-4">
            <Server size={13} />
            <span>REAL-TIME IPINFO INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            IP Intelligence
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Understand the network and geographic information associated with an IP address.
          </p>

          {/* Non-sensitive developer configuration status note */}
          {!hasToken && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <Info size={13} className="text-purple-500" />
              <span>
                Running via IPinfo public tier. Configure <code className="text-purple-600 dark:text-purple-300">VITE_IPINFO_TOKEN</code> in <code className="text-slate-700 dark:text-slate-300">.env</code> for dedicated quotas.
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Views: Loading OR Result OR Error OR Input Form */}
        {lookingUp ? (
          <IPLoadingState targetIp={inputIp} />
        ) : error ? (
          /* Section 19: Polished Error State */
          <div className="max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
            <GlassCard glow="danger" className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Unable to retrieve IP intelligence
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {error.message}
                </p>
                {error.developerNotice && (
                  <p className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-black/30 p-2 rounded-lg border border-slate-200 dark:border-white/5">
                    {error.developerNotice}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  icon={<RotateCcw size={14} />}
                  onClick={() => handleLookup()}
                >
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleReset}
                >
                  Change Input
                </Button>
              </div>
            </GlassCard>
          </div>
        ) : result ? (
          /* Section 17 & 18: Real IPinfo Result Visualization */
          <IPInfoResult result={result} onReset={handleReset} />
        ) : (
          /* Default: Search Form with Presets and Information */
          <div className="space-y-8">
            <IPInput
              value={inputIp}
              onChange={setInputIp}
              onSubmit={() => handleLookup()}
              loading={lookingUp}
              onSelectPreset={handlePresetSelect}
            />

            {/* Explanatory cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  1. Real Network IPinfo Telemetry
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  Direct live resolution from IPinfo.io for Autonomous System Numbers (ASNs), hosting operators, and geographic regions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  2. Approximate 3D Spatial Marker
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  Renders the latitude and longitude centroid on an interactive 3D globe, highlighting regional network presence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  3. Threat Profiling Engine
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  Evaluates RFC1918 bogons, Tor exit signatures, bulletproof transit hubs, and anycast DNS clusters.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
