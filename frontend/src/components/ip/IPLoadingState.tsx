import React, { useEffect, useState } from 'react';
import { SecurityCore } from '../visualizations/SecurityCore';
import { motion } from 'motion/react';
import { Activity, Sparkles, Loader2 } from 'lucide-react';

interface IPLoadingStateProps {
  targetIp: string;
}

const ROTATING_LABELS = [
  'RESOLVING IP',
  'RETRIEVING NETWORK DATA',
  'ANALYZING LOCATION',
  'IDENTIFYING ORGANIZATION',
  'EVALUATING AUTONOMOUS SYSTEM ROUTING',
];

export const IPLoadingState: React.FC<IPLoadingStateProps> = ({ targetIp }) => {
  const [labelIndex, setLabelIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLabelIndex((prev) => (prev + 1) % ROTATING_LABELS.length);
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      {/* Central Security Core in scanning mode */}
      <div className="relative mb-6">
        <SecurityCore state="scanning" size="md" interactive={false} />
      </div>

      {/* Rotating telemetry banner */}
      <div className="w-full max-w-md p-5 rounded-2xl bg-white/90 dark:bg-[#0c101a]/90 backdrop-blur-xl border border-purple-500/30 shadow-xl flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-mono mb-3">
          <Activity size={13} className="animate-pulse" />
          <span>REAL-TIME IP TELEMETRY PIPELINE</span>
        </div>

        {targetIp ? (
          <div className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
            Target: <span className="text-purple-600 dark:text-purple-400">{targetIp}</span>
          </div>
        ) : (
          <div className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
            Target: <span className="text-purple-600 dark:text-purple-400">Current Client Address</span>
          </div>
        )}

        {/* Dynamic Rotating Stage Label */}
        <div className="h-8 flex items-center justify-center">
          <motion.div
            key={labelIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
          >
            <Loader2 size={14} className="animate-spin text-purple-500" />
            <span>{ROTATING_LABELS[labelIndex]}</span>
          </motion.div>
        </div>

        {/* Small stream telemetry */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <Sparkles size={11} className="text-cyan-500" />
          <span>Querying IPinfo network endpoints...</span>
        </div>
      </div>
    </div>
  );
};
