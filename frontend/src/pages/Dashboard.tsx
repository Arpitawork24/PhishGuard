import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cpu,
  Globe,
  MessageSquare,
  Server,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import React, { useEffect, useState } from 'react';

import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { Badge } from '../components/common/Badge';
import { GlassCard } from '../components/common/GlassCard';
import { ThreatConstellation } from '../components/visualizations/ThreatConstellation';

import {
  getConstellationNodes,
  getDashboardStats,
} from '../services/dashboardService';

import { getScanHistory } from '../services/scanHistoryService';

import {
  ConstellationNode,
  DashboardStats,
} from '../types';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [nodes, setNodes] = useState<ConstellationNode[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * =========================================================
   * LOAD DASHBOARD DATA
   * =========================================================
   * Refreshes every 5 seconds so new scans appear automatically.
   */

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardStats, constellationNodes] = await Promise.all([
          getDashboardStats(),
          getConstellationNodes(),
        ]);

        setStats(dashboardStats);
        setNodes(constellationNodes);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);

  /*
   * =========================================================
   * REAL SCAN DISTRIBUTION
   * =========================================================
   * Based directly on the user's actual scan history.
   */

  const history = getScanHistory();

  const total = history.length;

  const phishingCount = history.filter(
    (scan) => scan.classification === 'PHISHING'
  ).length;

  const safeCount = history.filter(
    (scan) => scan.classification === 'SAFE'
  ).length;

  const scamCount = history.filter(
    (scan) => scan.classification === 'SCAM'
  ).length;

  const getPercent = (count: number) => {
    if (total === 0) return 0;

    return Math.round((count / total) * 100);
  };

  const phishingPercent = getPercent(phishingCount);
  const safePercent = getPercent(safeCount);
  const scamPercent = getPercent(scamCount);

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  if (loading || !stats) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
          <Activity className="animate-spin" size={18} />
          <span>Synchronizing Telemetry Feeds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 relative">

      <div className="ambient-gradient absolute top-0 inset-x-0 h-[700px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* =====================================================
            DASHBOARD HEADER
        ===================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono mb-2">

              <Cpu size={13} />

              <span>SECURITY COMMAND CENTER</span>

            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Global Cyber Threat Intelligence
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Autonomous telemetry aggregated from linguistic models, domain registrars, and global network probes.
            </p>

          </div>


          <div className="flex items-center gap-3">

            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm dark:shadow-none">

              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />

              <span>Real-Time Stream Active</span>

            </div>

          </div>

        </div>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {/* Total Scans */}

          <GlassCard tiltEnabled={true} className="p-4 sm:p-5">

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">

              <span className="text-[11px] font-mono uppercase tracking-wider">
                Total Scans
              </span>

              <Activity
                size={14}
                className="text-cyan-500 dark:text-cyan-400"
              />

            </div>

            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-mono">

              <AnimatedCounter value={stats.totalScans} />

            </div>

            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 flex items-center gap-1">

              <TrendingUp size={11} />

              Live telemetry

            </div>

          </GlassCard>


          {/* Threats */}

          <GlassCard
            tiltEnabled={true}
            glow="danger"
            className="p-4 sm:p-5"
          >

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">

              <span className="text-[11px] font-mono uppercase tracking-wider">
                Threats
              </span>

              <ShieldAlert
                size={14}
                className="text-rose-500 dark:text-rose-400"
              />

            </div>

            <div className="text-2xl sm:text-3xl font-bold text-rose-500 dark:text-rose-400 font-mono">

              <AnimatedCounter value={stats.threatsDetected} />

            </div>

            <div className="text-[10px] text-rose-600 dark:text-rose-300 font-mono mt-1">

              {stats.totalScans > 0
                ? Math.round(
                    (stats.threatsDetected / stats.totalScans) * 100
                  )
                : 0}
              % attack ratio

            </div>

          </GlassCard>


          {/* Safe Verified */}

          <GlassCard
            tiltEnabled={true}
            glow="safe"
            className="p-4 sm:p-5"
          >

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">

              <span className="text-[11px] font-mono uppercase tracking-wider">
                Safe Verified
              </span>

              <ShieldCheck
                size={14}
                className="text-emerald-500 dark:text-emerald-400"
              />

            </div>

            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">

              <AnimatedCounter value={stats.safeResults} />

            </div>

            <div className="text-[10px] text-emerald-600 dark:text-emerald-300 font-mono mt-1">
              Clean baseline
            </div>

          </GlassCard>


          {/* Suspicious */}

          <GlassCard
            tiltEnabled={true}
            glow="warning"
            className="p-4 sm:p-5"
          >

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">

              <span className="text-[11px] font-mono uppercase tracking-wider">
                Suspicious
              </span>

              <AlertTriangle
                size={14}
                className="text-amber-500 dark:text-amber-400"
              />

            </div>

            <div className="text-2xl sm:text-3xl font-bold text-amber-500 dark:text-amber-400 font-mono">

              <AnimatedCounter value={stats.suspiciousResults} />

            </div>

            <div className="text-[10px] text-amber-600 dark:text-amber-300 font-mono mt-1">
              Under investigation
            </div>

          </GlassCard>


          {/* URLs */}

          <GlassCard tiltEnabled={true} className="p-4 sm:p-5">

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">

              <span className="text-[11px] font-mono uppercase tracking-wider">
                URLs Analyzed
              </span>

              <Globe
                size={14}
                className="text-blue-500 dark:text-blue-400"
              />

            </div>

            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">

              <AnimatedCounter value={stats.urlsAnalyzed} />

            </div>

            <div className="text-[10px] text-slate-500 font-mono mt-1">
              Domain sandboxes
            </div>

          </GlassCard>


          {/* IP */}

          <GlassCard tiltEnabled={true} className="p-4 sm:p-5">

            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">

              <span className="text-[11px] font-mono uppercase tracking-wider">
                IP Lookups
              </span>

              <Server
                size={14}
                className="text-purple-500 dark:text-purple-400"
              />

            </div>

            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 font-mono">

              <AnimatedCounter value={stats.ipLookups} />

            </div>

            <div className="text-[10px] text-slate-500 font-mono mt-1">
              ASN infrastructure
            </div>

          </GlassCard>

        </div>


        {/* =====================================================
            THREAT CONSTELLATION
        ===================================================== */}

        <div>
          <ThreatConstellation nodes={nodes} />
        </div>


        {/* =====================================================
            RECENT TELEMETRY + SCAN DISTRIBUTION
        ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ===================================================
              RECENT TELEMETRY STREAM
          =================================================== */}

          <GlassCard className="lg:col-span-8 p-5 sm:p-6">

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">

              <div className="flex items-center gap-2">

                <Activity
                  size={16}
                  className="text-cyan-500 dark:text-cyan-400"
                />

                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Recent Telemetry Stream
                </h3>

              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Live feed
              </span>

            </div>


            <div className="space-y-3">

              {stats.recentActivity.length === 0 ? (

                <div className="text-center py-10 text-slate-500 font-mono text-xs">
                  No scan telemetry available yet.
                </div>

              ) : (

                stats.recentActivity.map((item) => (

                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3 text-xs shadow-sm dark:shadow-none"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="p-2 rounded-lg bg-white dark:bg-black/40 text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200/60 dark:border-transparent">

                        {item.type === 'MESSAGE' && (
                          <MessageSquare
                            size={14}
                            className="text-cyan-500 dark:text-cyan-400"
                          />
                        )}

                        {item.type === 'URL' && (
                          <Globe
                            size={14}
                            className="text-blue-500 dark:text-blue-400"
                          />
                        )}

                        {item.type === 'IP' && (
                          <Server
                            size={14}
                            className="text-purple-500 dark:text-purple-400"
                          />
                        )}

                      </div>


                      <div className="min-w-0">

                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-sm">
                          {item.target}
                        </div>

                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">

                          <span>{item.type}</span>

                          <span>•</span>

                          <span>{item.timeAgo}</span>

                        </div>

                      </div>

                    </div>


                    <div className="flex items-center gap-3 shrink-0">

                      <Badge
                        classification={item.classification}
                        size="sm"
                      />

                      <span
                        className={`font-mono font-bold text-xs ${
                          item.riskScore > 75
                            ? 'text-rose-500 dark:text-rose-400'
                            : item.riskScore > 40
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-emerald-500 dark:text-emerald-400'
                        }`}
                      >
                        {item.riskScore}%
                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          </GlassCard>


          {/* ===================================================
              SCAN DISTRIBUTION
          =================================================== */}

          <GlassCard className="lg:col-span-4 p-5 sm:p-6">

            <div>

              <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-white/10">

                <BarChart3
                  size={16}
                  className="text-cyan-500 dark:text-cyan-400"
                />

                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  Scan Distribution
                </h3>

              </div>


              <div className="space-y-5 text-xs font-mono">


                {/* =================================================
                    PHISHING
                ================================================= */}

                <div>

                  <div className="flex items-center justify-between mb-1.5">

                    <span className="text-slate-700 dark:text-slate-300">
                      Phishing Detections
                    </span>

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] text-slate-500">
                        {phishingCount}{' '}
                        {phishingCount === 1 ? 'scan' : 'scans'}
                      </span>

                      <span className="text-rose-500 dark:text-rose-400 font-bold">
                        {phishingPercent}%
                      </span>

                    </div>

                  </div>


                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${phishingPercent}%`,
                      }}
                    />

                  </div>

                </div>


                {/* =================================================
                    SAFE
                ================================================= */}

                <div>

                  <div className="flex items-center justify-between mb-1.5">

                    <span className="text-slate-700 dark:text-slate-300">
                      Verified Safe
                    </span>

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] text-slate-500">
                        {safeCount}{' '}
                        {safeCount === 1 ? 'scan' : 'scans'}
                      </span>

                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                        {safePercent}%
                      </span>

                    </div>

                  </div>


                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${safePercent}%`,
                      }}
                    />

                  </div>

                </div>


                {/* =================================================
                    SCAM
                ================================================= */}

                <div>

                  <div className="flex items-center justify-between mb-1.5">

                    <span className="text-slate-700 dark:text-slate-300">
                      Scam Detections
                    </span>

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] text-slate-500">
                        {scamCount}{' '}
                        {scamCount === 1 ? 'scan' : 'scans'}
                      </span>

                      <span className="text-orange-500 dark:text-orange-400 font-bold">
                        {scamPercent}%
                      </span>

                    </div>

                  </div>


                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-700"
                      style={{
                        width: `${scamPercent}%`,
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  LIVE ANALYTICS
              ================================================= */}

              <div className="mt-5 p-3 rounded-xl bg-cyan-500/5 dark:bg-cyan-400/5 border border-cyan-500/10 text-[10px] text-slate-600 dark:text-slate-400">

                <div className="font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                  LIVE ANALYTICS
                </div>

                <div>
                  Distribution is calculated from your actual scan history.
                </div>

                {total > 0 && (
                  <div className="mt-1">
                    {total} total {total === 1 ? 'scan' : 'scans'} recorded.
                  </div>
                )}

              </div>

            </div>

          </GlassCard>

        </div>


        {/* =====================================================
            RISK TREND
            FULL WIDTH — OUTSIDE THE 12-COLUMN GRID
        ===================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">

          {/* Header */}

          <div className="mb-5 flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">

                <TrendingUp
                  size={16}
                  className="text-cyan-400"
                />

                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-200">
                  Risk Trend
                </h3>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                Risk levels across your latest scans
              </p>

            </div>


            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-xs font-mono text-cyan-400">

              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />

              LIVE ANALYTICS

            </div>

          </div>


          {/* Divider */}

          <div className="border-t border-slate-800 mb-5" />


          {/* Risk Rows */}

          <div className="space-y-4">

            {(stats?.recentActivity || [])
              .slice(0, 8)
              .map((scan, index) => {

                const risk = Math.max(
                  0,
                  Math.min(100, scan.riskScore)
                );

                return (

                  <div
                    key={scan.id}
                    className="grid grid-cols-[40px_100px_1fr_55px] items-center gap-4"
                  >

                    {/* Number */}

                    <div className="text-xs font-mono text-slate-600">
                      {String(index + 1).padStart(2, '0')}
                    </div>


                    {/* Scan Type */}

                    <div className="truncate text-xs font-medium text-slate-400 uppercase">
                      {scan.type}
                    </div>


                    {/* Risk Bar */}

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          risk >= 65
                            ? 'bg-rose-500'
                            : risk >= 35
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{
                          width: `${risk}%`,
                        }}
                      />

                    </div>


                    {/* Percentage */}

                    <div
                      className={`text-right text-xs font-bold ${
                        risk >= 65
                          ? 'text-rose-400'
                          : risk >= 35
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {risk}%
                    </div>

                  </div>

                );

              })}

          </div>


          {/* Empty State */}

          {(!stats?.recentActivity ||
            stats.recentActivity.length === 0) && (

            <div className="py-8 text-center text-xs text-slate-500">
              No scan data available yet.
            </div>

          )}

        </div>

      </div>

    </div>
  );
};