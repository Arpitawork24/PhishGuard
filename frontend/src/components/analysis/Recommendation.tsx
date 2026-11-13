import React from 'react';
import { ThreatClassification } from '../../types';
import { ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

interface RecommendationProps {
  classification: ThreatClassification;
  recommendation: string;
  className?: string;
}

export const Recommendation: React.FC<RecommendationProps> = ({
  classification,
  recommendation,
  className = '',
}) => {
  const isDangerous = classification === 'PHISHING' || classification === 'MALWARE';
  const isSuspicious = classification === 'SUSPICIOUS' || classification === 'SCAM';

  const getTheme = () => {
    if (isDangerous) {
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30 text-rose-900 dark:text-rose-200',
        title: 'text-rose-700 dark:text-rose-300',
        icon: <AlertOctagon size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />,
      };
    }
    if (isSuspicious) {
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 text-amber-900 dark:text-amber-200',
        title: 'text-amber-700 dark:text-amber-300',
        icon: <HelpCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />,
      };
    }
    return {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
      title: 'text-emerald-700 dark:text-emerald-300',
      icon: <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />,
    };
  };

  const theme = getTheme();

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 ${theme.bg} ${className}`}
    >
      {theme.icon}
      <div className="space-y-1 text-xs sm:text-sm">
        <div className={`font-mono font-bold uppercase tracking-wider text-[11px] ${theme.title}`}>
          Recommended Cyber Defense Action
        </div>
        <p className="leading-relaxed font-sans">{recommendation}</p>
      </div>
    </div>
  );
};
