import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, Sparkles, Activity } from 'lucide-react';

interface AnalysisAnimationProps {
  onComplete?: () => void;
  targetType?: 'message' | 'url' | 'ip';
  targetPreview?: string;
}

interface Stage {
  id: string;
  label: string;
  durationMs: number;
}

const MESSAGE_STAGES: Stage[] = [
  { id: '1', label: 'READING MESSAGE', durationMs: 450 },
  { id: '2', label: 'EXTRACTING INDICATORS', durationMs: 500 },
  { id: '3', label: 'ANALYZING LANGUAGE', durationMs: 550 },
  { id: '4', label: 'CHECKING LINKS', durationMs: 600 },
  { id: '5', label: 'DETECTING SOCIAL ENGINEERING', durationMs: 550 },
  { id: '6', label: 'CLASSIFYING THREAT', durationMs: 450 },
];

const URL_STAGES: Stage[] = [
  { id: '1', label: 'Resolving Target Hostname & IP', durationMs: 400 },
  { id: '2', label: 'Inspecting SSL/TLS Chain & Issuer Validity', durationMs: 500 },
  { id: '3', label: 'Analyzing Domain Age & WHOIS History', durationMs: 500 },
  { id: '4', label: 'Tracing HTTP Redirect Hops & Sandboxing', durationMs: 600 },
  { id: '5', label: 'Cross-referencing Global Threat Feeds', durationMs: 500 },
  { id: '6', label: 'Calculating Autonomous Risk Rating', durationMs: 400 },
];

const IP_STAGES: Stage[] = [
  { id: '1', label: 'Routing Autonomous System Number (ASN)', durationMs: 400 },
  { id: '2', label: 'Probing Geolocation & Physical Infrastructure', durationMs: 450 },
  { id: '3', label: 'Checking AbuseIPDB & Tor Exit Signatures', durationMs: 500 },
  { id: '4', label: 'Scanning Active Port Exposure & Services', durationMs: 500 },
  { id: '5', label: 'Evaluating Historical Botnet & C2 Activity', durationMs: 450 },
  { id: '6', label: 'Synthesizing Network Intelligence Profile', durationMs: 400 },
];

export const AnalysisAnimation: React.FC<AnalysisAnimationProps> = ({
  onComplete,
  targetType = 'message',
  targetPreview = '',
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const stages =
    targetType === 'message'
      ? MESSAGE_STAGES
      : targetType === 'url'
      ? URL_STAGES
      : IP_STAGES;

  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    'Initializing PhishGuard neural scanning pipeline...',
    'Establishing secure sandbox container...',
  ]);

  useEffect(() => {
    let timeoutId: number;

    if (currentStageIndex < stages.length) {
      const current = stages[currentStageIndex];
      timeoutId = window.setTimeout(() => {
        setTelemetryLogs((prev) => [
          ...prev.slice(-4),
          `[OK] ${current.label} complete (${current.durationMs}ms)`,
        ]);
        setCurrentStageIndex((prev) => prev + 1);
      }, current.durationMs);
    } else {
      timeoutId = window.setTimeout(() => {
        if (onComplete) onComplete();
      }, 400);
    }

    return () => clearTimeout(timeoutId);
  }, [currentStageIndex, stages, onComplete]);

  const totalProgress = Math.round(
    (Math.min(currentStageIndex, stages.length) / stages.length) * 100
  );

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Stream particles banner */}
      <div className="w-full mb-6 p-4 rounded-xl bg-white/90 dark:bg-[#0c101a]/90 backdrop-blur-xl border border-cyan-500/30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
              <Activity size={13} className="animate-pulse" />
              Analysis In Progress
            </div>
            {targetPreview && (
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs mt-0.5 font-mono">
                {targetPreview}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-xl font-bold text-cyan-600 dark:text-cyan-400 tabular-nums">
            {totalProgress}%
          </span>
        </div>
      </div>

      {/* Modern Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6 relative">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${totalProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Sequential Analysis Stages Checklist */}
      <div className="w-full rounded-2xl p-5 sm:p-6 bg-white/90 dark:bg-[#0c101a]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-none space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-cyan-500/10 border border-cyan-500/30 text-slate-900 dark:text-white'
                  : isDone
                  ? 'text-slate-700 dark:text-slate-300'
                  : 'text-slate-400 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">0{stage.id}</span>
                <span className="text-xs sm:text-sm font-medium">{stage.label}</span>
              </div>

              <div className="flex items-center gap-2">
                {isDone && (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                    <CheckCircle2 size={16} />
                  </span>
                )}
                {isCurrent && (
                  <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-mono text-xs">
                    <Loader2 size={15} className="animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                  </span>
                )}
                {isPending && (
                  <span className="font-mono text-xs text-slate-400">Queued</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Telemetry Log Stream */}
      <div className="w-full mt-4 p-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 font-mono text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed overflow-hidden">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400/80 mb-1">
          <Sparkles size={12} />
          <span className="text-[10px] tracking-wider uppercase">Sandbox Telemetry</span>
        </div>
        {telemetryLogs.map((log, i) => (
          <div key={i} className="truncate text-slate-700 dark:text-slate-300">
            &gt; {log}
          </div>
        ))}
      </div>
    </div>
  );
};
