import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export interface AnalysisStageItem {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface AnalysisStagesProps {
  stages: AnalysisStageItem[];
  className?: string;
}

export const AnalysisStages: React.FC<AnalysisStagesProps> = ({ stages, className = '' }) => {
  return (
    <div className={`space-y-2 font-mono text-xs ${className}`}>
      {stages.map((stage) => {
        const isDone = stage.status === 'completed';
        const isCurrent = stage.status === 'in_progress';

        return (
          <div
            key={stage.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
              isDone
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : isCurrent
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-800 dark:text-cyan-300 shadow-sm'
                : 'bg-slate-100/60 dark:bg-black/20 border-slate-200/60 dark:border-white/5 text-slate-500'
            }`}
          >
            <span className="font-semibold tracking-wider">{stage.name}</span>
            <div className="flex items-center gap-1.5">
              {isDone ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Check size={13} className="stroke-[3]" />
                  <span>DONE</span>
                </span>
              ) : isCurrent ? (
                <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  <span>ANALYZING</span>
                </span>
              ) : (
                <span className="text-slate-400 dark:text-slate-600">QUEUED</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
