import React from 'react';
import { ThreatIndicator } from '../../types';
import { ShieldAlert, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface ThreatIndicatorsProps {
  indicators: ThreatIndicator[];
  className?: string;
}

export const ThreatIndicators: React.FC<ThreatIndicatorsProps> = ({
  indicators,
  className = '',
}) => {
  const getSeverityBadge = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30';
      case 'low':
      default:
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={13} className="text-rose-500" />;
      case 'high':
        return <ShieldAlert size={13} className="text-amber-500" />;
      case 'medium':
        return <AlertTriangle size={13} className="text-yellow-500" />;
      case 'low':
      default:
        return <Info size={13} className="text-blue-500" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert size={17} className="text-cyan-600 dark:text-cyan-400" />
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Identified Threat Indicators ({indicators.length})
          </h4>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Severity Assessed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {indicators.map((ind) => (
          <div
            key={ind.id}
            className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all text-xs"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-semibold text-slate-900 dark:text-white tracking-wide">
                {ind.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border inline-flex items-center gap-1 ${getSeverityBadge(
                  ind.severity
                )}`}
              >
                {getSeverityIcon(ind.severity)}
                <span>{ind.severity}</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              {ind.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
