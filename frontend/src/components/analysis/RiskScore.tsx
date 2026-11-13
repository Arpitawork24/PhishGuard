import React, { useEffect, useRef, useState } from 'react';
import { ThreatClassification } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Lock, Activity } from 'lucide-react';

interface RiskScoreProps {
  score: number;
  confidence?: number;
  classification: ThreatClassification;
  size?: 'md' | 'lg';
  className?: string;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  confidence = 94,
  classification,
  size = 'lg',
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Target score clamped between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));

  const [displayScore, setDisplayScore] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [bouncing, setBouncing] = useState<boolean>(false);

  // SVG geometry
  const radius = size === 'lg' ? 68 : 52;
  const strokeWidth = size === 'lg' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const svgSize = (radius + strokeWidth) * 2 + 16;

  // Animate the counter using requestAnimationFrame for 100% reliable execution
  useEffect(() => {
    let animId: number;
    let startTimestamp: number | null = null;
    const duration = 1400; // 1.4s smooth roll
    const startScore = 0;

    setIsRolling(true);
    setIsLocked(false);
    setBouncing(false);
    setDisplayScore(0);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth Ease-Out Expo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startScore + (clampedScore - startScore) * ease);

      setDisplayScore(current);

      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      } else {
        setDisplayScore(clampedScore);
        setIsRolling(false);
        setIsLocked(true);
        setBouncing(true);
        setTimeout(() => setBouncing(false), 500);
      }
    };

    animId = window.requestAnimationFrame(step);

    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [clampedScore]);

  // Color mappings tuned for maximum readability in both soft warm light and dark modes
  const getColorScheme = (val: number) => {
    if (val > 75) {
      return {
        stroke: isDark ? '#f43f5e' : '#e11d48',
        glow: isDark ? 'rgba(244, 63, 94, 0.45)' : 'rgba(225, 29, 72, 0.25)',
        text: isDark ? 'text-rose-400' : 'text-rose-700',
        percent: isDark ? 'text-rose-300/80' : 'text-rose-800',
        badge: isDark
          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
          : 'bg-rose-100 text-rose-900 border-rose-300 font-semibold',
      };
    }
    if (val > 39) {
      return {
        stroke: isDark ? '#f59e0b' : '#d97706',
        glow: isDark ? 'rgba(245, 158, 11, 0.45)' : 'rgba(217, 119, 6, 0.25)',
        text: isDark ? 'text-amber-400' : 'text-amber-800',
        percent: isDark ? 'text-amber-300/80' : 'text-amber-900',
        badge: isDark
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          : 'bg-amber-100 text-amber-950 border-amber-300 font-semibold',
      };
    }
    return {
      stroke: isDark ? '#10b981' : '#059669',
      glow: isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(5, 150, 105, 0.25)',
      text: isDark ? 'text-emerald-400' : 'text-emerald-800',
      percent: isDark ? 'text-emerald-300/80' : 'text-emerald-900',
      badge: isDark
        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-950 border-emerald-300 font-semibold',
    };
  };

  const colors = getColorScheme(displayScore);
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${className}`}
    >
      <div
        className={`relative flex items-center justify-center transition-transform duration-500 ${
          bouncing ? 'scale-105' : 'scale-100'
        }`}
      >
        {/* SVG Radial Arc Gauge */}
        <svg
          width={svgSize}
          height={svgSize}
          className="-rotate-90 transform drop-shadow-sm"
        >
          {/* Background Track Circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 100, 80, 0.15)'}
            strokeWidth={strokeWidth}
          />

          {/* Animated Gauge Arc */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${colors.glow})`,
              transition: 'stroke 0.3s ease, stroke-dashoffset 0.08s linear',
            }}
          />
        </svg>

        {/* Center Live Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          {/* Category Eyebrow */}
          <span className="text-[11px] font-mono font-bold tracking-wider text-stone-700 dark:text-slate-400 uppercase mb-0.5">
            Risk Score
          </span>

          {/* Bold, Guaranteed Number & Percentage */}
          <div className="flex items-baseline justify-center font-mono leading-none my-0.5">
            <span
              className={`font-black tracking-tight tabular-nums transition-colors duration-200 ${
                size === 'lg' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'
              } ${colors.text}`}
            >
              {displayScore}
            </span>
            <span
              className={`font-bold ml-1 transition-colors duration-200 ${
                size === 'lg' ? 'text-lg sm:text-xl' : 'text-base'
              } ${colors.percent}`}
            >
              %
            </span>
          </div>

          {/* Dynamic Status / Lock-in Tag */}
          <div className="mt-1 flex items-center justify-center min-h-[22px]">
            {isRolling ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 animate-pulse uppercase tracking-wider font-semibold">
                <Activity size={10} className="animate-spin" />
                Scoring
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border shadow-sm transition-all duration-300 ${colors.badge}`}
              >
                <Lock size={10} className="shrink-0" />
                <span>{confidence}% Conf.</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
