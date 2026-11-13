import React from 'react';
import { ThreatClassification } from '../../types';
import { ShieldCheck, AlertTriangle, ShieldAlert, Bug, Flame } from 'lucide-react';

interface BadgeProps {
  classification: ThreatClassification;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  classification,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (classification) {
      case 'SAFE':
        return {
          label: 'SAFE',
          icon: ShieldCheck,
          styles: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-500/30',
          dot: 'bg-emerald-500 dark:bg-emerald-400',
        };
      case 'SUSPICIOUS':
        return {
          label: 'SUSPICIOUS',
          icon: AlertTriangle,
          styles: 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/40 dark:border-amber-500/30',
          dot: 'bg-amber-500 dark:bg-amber-400',
        };
      case 'PHISHING':
        return {
          label: 'PHISHING DETECTED',
          icon: ShieldAlert,
          styles: 'bg-rose-500/15 text-rose-900 dark:text-rose-300 border-rose-500/40 shadow-sm shadow-rose-950/10 dark:shadow-rose-950/40',
          dot: 'bg-rose-600 dark:bg-rose-400 animate-pulse',
        };
      case 'SCAM':
        return {
          label: 'SCAM / FRAUD',
          icon: Flame,
          styles: 'bg-orange-500/15 text-orange-900 dark:text-orange-300 border-orange-500/40',
          dot: 'bg-orange-500 dark:bg-orange-400',
        };
      case 'MALWARE':
        return {
          label: 'MALWARE PAYLOAD',
          icon: Bug,
          styles: 'bg-red-500/15 text-red-900 dark:text-red-300 border-red-500/50 shadow-sm shadow-red-950/10 dark:shadow-red-950/50',
          dot: 'bg-red-600 dark:bg-red-400 animate-ping',
        };
      default:
        return {
          label: classification,
          icon: ShieldCheck,
          styles: 'bg-stone-500/15 text-stone-800 dark:text-slate-200 border-stone-500/30 dark:border-slate-500/20',
          dot: 'bg-stone-500 dark:bg-slate-400',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs gap-1.5',
    md: 'px-3.5 py-1 text-xs gap-2 tracking-wide font-semibold',
    lg: 'px-4 py-1.5 text-sm gap-2.5 font-bold tracking-wider',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${config.styles} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon size={iconSizes} className="shrink-0" />}
      <span className="font-mono uppercase">{config.label}</span>
    </span>
  );
};
