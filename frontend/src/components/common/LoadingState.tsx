import React from 'react';
import { SecurityCore } from '../visualizations/SecurityCore';
import { Activity } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'ANALYZING THREAT INTEL...',
  subLabel = 'Evaluating cryptographic and heuristic indicators',
  size = 'md',
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center my-4">
      <SecurityCore state="scanning" size={size} interactive={false} />
      <div className="mt-6 space-y-1.5 font-mono">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
          <Activity size={12} className="animate-pulse" />
          <span>{label}</span>
        </div>
        {subLabel && (
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
};
