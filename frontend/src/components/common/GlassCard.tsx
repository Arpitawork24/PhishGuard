import React from 'react';
import { useTilt } from '../../hooks/useTilt';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tiltEnabled?: boolean;
  glow?: 'none' | 'cyan' | 'safe' | 'warning' | 'danger';
  interactive?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  tiltEnabled = true,
  glow = 'none',
  interactive = false,
  onClick,
  id,
}) => {
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const { cardRef, tilt, handlers } = useTilt(tiltEnabled && !reducedMotion ? 3.5 : 0);

  const glowStyles = {
    none: '',
    cyan:
      theme === 'dark'
        ? 'shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] border-cyan-500/30'
        : 'shadow-[0_10px_30px_-5px_rgba(2,132,199,0.2)] border-cyan-500/40',
    safe:
      theme === 'dark'
        ? 'shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] border-emerald-500/30'
        : 'shadow-[0_10px_30px_-5px_rgba(16,185,129,0.2)] border-emerald-500/40',
    warning:
      theme === 'dark'
        ? 'shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] border-amber-500/30'
        : 'shadow-[0_10px_30px_-5px_rgba(245,158,11,0.2)] border-amber-500/40',
    danger:
      theme === 'dark'
        ? 'shadow-[0_0_45px_-10px_rgba(239,68,68,0.25)] border-rose-500/35'
        : 'shadow-[0_10px_30px_-5px_rgba(239,68,68,0.2)] border-rose-500/40',
  }[glow];

  const transformStyle =
    tiltEnabled && !reducedMotion && tilt.isHovered
      ? {
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateY(-2px)`,
          transition: 'transform 0.1s ease-out',
        }
      : {
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        };

  return (
    <div
      id={id}
      ref={cardRef}
      style={transformStyle}
      onClick={onClick}
      {...(tiltEnabled ? handlers : {})}
      className={`relative rounded-2xl p-6 sm:p-7 overflow-hidden border border-stone-200/90 dark:border-white/[0.08] bg-[#fdfcf9]/95 dark:bg-[#0c101a]/75 text-stone-900 dark:text-white backdrop-blur-xl shadow-lg shadow-stone-300/30 dark:shadow-none transition-all duration-300 ${glowStyles} ${
        interactive ? 'cursor-pointer hover:border-cyan-500/40 hover:bg-[#ffffff] dark:hover:bg-slate-900/80' : ''
      } ${className}`}
    >
      {/* Dynamic Specular Cursor Spotlight */}
      {tiltEnabled && !reducedMotion && tilt.isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${tilt.spotlightX}% ${tilt.spotlightY}%, ${
              theme === 'dark' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.1)'
            }, transparent 70%)`,
          }}
        />
      )}

      {/* Subtle top specular line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-300/70 dark:via-white/15 to-transparent" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
