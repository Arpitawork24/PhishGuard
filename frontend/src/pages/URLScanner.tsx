import React, { useState } from 'react';
import { SAMPLE_URLS } from '../data/mockData';
import { analyzeUrl } from '../services/urlService';
import { UrlAnalysisResult } from '../types';
import { SecurityCore } from '../components/visualizations/SecurityCore';
import { AnalysisAnimation } from '../components/analysis/AnalysisAnimation';
import { RiskScore } from '../components/analysis/RiskScore';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import {
  Globe,
  Lock,
  Calendar,
  Layers,
  Server,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';

export const URLScanner: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://secure-chase-update.co/login');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  const handleStartScan = async () => {
    if (!inputUrl.trim() || scanning) return;
    setScanning(true);
    setResult(null);

    try {
      const res = await analyzeUrl(inputUrl);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const getGlow = (classification: string) => {
    if (classification === 'SAFE') return 'safe';
    if (classification === 'SUSPICIOUS') return 'warning';
    return 'danger';
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 relative">
      <div className="ambient-gradient absolute top-0 inset-x-0 h-[600px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono mb-4">
            <Globe size={13} />
            <span>DOMAIN & HYPERLINK TELEMETRY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Investigate Before You Click
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Deconstruct malicious domains, unmask redirect evasion chains, and evaluate SSL validity.
          </p>
        </div>

        {/* Central Visualizer */}
        <div className="flex justify-center mb-6">
          <SecurityCore
            state={scanning ? 'scanning' : result ? 'result' : 'idle'}
            resultClassification={result?.classification || null}
            size="md"
            interactive={!scanning}
          />
        </div>

        {/* Input Form or Scanning Sequence or Result View */}
        {scanning ? (
          <div className="my-8">
            <AnalysisAnimation targetType="url" targetPreview={inputUrl} />
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Primary URL Result Overview Card */}
            <GlassCard glow={getGlow(result.classification)}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/90 dark:border-white/10">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2 font-mono text-xs font-semibold text-stone-700 dark:text-slate-400">
                    <span>HOST REPORT #{result.id}</span>
                    <span className="text-stone-400 dark:text-slate-600">•</span>
                    <span className="text-stone-700 dark:text-slate-400">{result.timestamp}</span>
                  </div>

                  <div className="mb-3">
                    <Badge classification={result.classification} size="lg" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-white break-all mb-2">
                    {result.url}
                  </h2>

                  <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed max-w-lg font-normal">
                    {result.explanation}
                  </p>
                </div>

                <div className="shrink-0 p-3.5 rounded-2xl bg-stone-100/90 dark:bg-black/30 border border-stone-200/90 dark:border-white/5 shadow-inner dark:shadow-none">
                  <RiskScore
                    score={result.riskScore}
                    confidence={95}
                    classification={result.classification}
                    size="lg"
                  />
                </div>
              </div>

              {/* URL Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-stone-200/90 dark:border-white/10 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/40 border border-stone-200/90 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-700 dark:text-slate-400 font-mono mb-1 font-semibold">
                    <Lock size={13} className="text-cyan-600 dark:text-cyan-400" />
                    <span>SSL STATUS</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-white">{result.sslStatus}</div>
                  <div className="text-[10px] text-stone-600 dark:text-slate-400 truncate mt-0.5 font-medium">{result.sslIssuer}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/40 border border-stone-200/90 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-700 dark:text-slate-400 font-mono mb-1 font-semibold">
                    <Calendar size={13} className="text-blue-600 dark:text-blue-400" />
                    <span>DOMAIN AGE</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-white">{result.domainAge}</div>
                  <div className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5 font-medium">Created: {result.creationDate}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/40 border border-stone-200/90 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-700 dark:text-slate-400 font-mono mb-1 font-semibold">
                    <Server size={13} className="text-purple-600 dark:text-purple-400" />
                    <span>HOST IP</span>
                  </div>
                  <div className="font-semibold font-mono text-stone-900 dark:text-white">{result.ipAddress}</div>
                  <div className="text-[10px] text-stone-600 dark:text-slate-400 truncate mt-0.5 font-medium">{result.serverLocation}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/40 border border-stone-200/90 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-stone-700 dark:text-slate-400 font-mono mb-1 font-semibold">
                    <Layers size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>REDIRECT HOPS</span>
                  </div>
                  <div className="font-semibold text-stone-900 dark:text-white">{result.redirects.length} Step(s)</div>
                  <div className="text-[10px] text-stone-600 dark:text-slate-400 mt-0.5 font-medium">
                    {result.redirects.length > 1 ? 'Multi-hop detected' : 'Direct host'}
                  </div>
                </div>
              </div>

              {/* Redirect Trace if multi-hop */}
              {result.redirects.length > 1 && (
                <div className="py-5 border-b border-stone-200/90 dark:border-white/10">
                  <div className="text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-slate-400 mb-2 font-bold">
                    Evasive Redirect Trace
                  </div>
                  <div className="space-y-1.5 font-mono text-xs">
                    {result.redirects.map((hop, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-stone-100/90 dark:bg-black/40 border border-stone-200/90 dark:border-white/5 text-stone-900 dark:text-slate-300"
                      >
                        <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold">0{idx + 1}</span>
                        <ArrowRight size={12} className="text-stone-500 dark:text-slate-500" />
                        <span className="truncate">{hop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Threat Indicators List */}
              <div className="pt-6">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-slate-400 mb-3 font-bold">
                  Domain Threat Indicators
                </div>
                <div className="space-y-2.5">
                  {result.threatIndicators.map((ind) => (
                    <div
                      key={ind.id}
                      className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/50 border border-stone-200/90 dark:border-white/5 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-white mb-0.5">{ind.name}</div>
                        <p className="text-stone-700 dark:text-slate-400 text-[11px] leading-relaxed">{ind.description}</p>
                      </div>
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded shrink-0 font-semibold ${
                          ind.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-800 dark:text-rose-400 border border-rose-500/40'
                            : ind.severity === 'high'
                            ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {ind.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-5 border-t border-stone-200/90 dark:border-white/10 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<RotateCcw size={14} />}
                  onClick={() => setResult(null)}
                >
                  Scan Another URL
                </Button>
              </div>
            </GlassCard>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Presets */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-700 dark:text-slate-400 flex items-center gap-1.5 font-bold">
                  <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
                  Preset Target Domains
                </span>
                <span className="text-xs text-stone-600 dark:text-slate-500 font-mono hidden sm:inline">Click to pre-fill</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_URLS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputUrl(url);
                      setResult(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/90 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-stone-200/90 dark:border-white/5 hover:border-blue-500/40 text-xs font-mono text-stone-800 hover:text-stone-950 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer shadow-sm dark:shadow-none font-medium"
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Card */}
            <GlassCard className="p-4 sm:p-5 border-blue-500/20">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-stone-500 dark:text-slate-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStartScan()}
                    placeholder="https://suspicious-domain-to-verify.com"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-stone-100/90 dark:bg-black/40 border border-stone-200/90 dark:border-white/10 text-stone-900 dark:text-slate-100 placeholder-stone-500 dark:placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-blue-500 dark:focus:border-blue-400/60 transition-colors"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  magnetic={true}
                  onClick={handleStartScan}
                  disabled={!inputUrl.trim()}
                  icon={<Globe size={16} />}
                  className="w-full sm:w-auto"
                >
                  Scan URL
                </Button>
              </div>
            </GlassCard>

            {/* Technical Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono text-slate-600 dark:text-slate-400">
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Typosquatting Analysis</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Detects lookalike Unicode and character substitutions targeting reputable brands.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Redirect Sandboxing</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Follows automated HTTP 301/302 chains to expose cloaked payload endpoints.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">Reputation Cross-Check</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Queries threat telemetry feeds for blacklisted infrastructure and malicious C2 nodes.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
