import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles, Shield, Radio, Zap } from 'lucide-react';

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  char: string;
  delay: number;
}

export const ThemeTransitionEffect: React.FC = () => {
  const { transitionInfo } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [maxRadius, setMaxRadius] = useState<number>(1000);

  useEffect(() => {
    if (transitionInfo?.active) {
      const { x, y } = transitionInfo.origin;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const r = Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
      setMaxRadius(r);

      // Generate 12 radial spark particles
      const isLight = transitionInfo.toTheme === 'light';
      const sparkColors = isLight
        ? ['#f59e0b', '#fbbf24', '#0284c7', '#38bdf8', '#f97316']
        : ['#06b6d4', '#22d3ee', '#8b5cf6', '#a855f7', '#3b82f6'];

      const chars = ['✦', '◆', '•', '★', '◇'];

      const newParticles: Particle[] = Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        angle: (i * (360 / 14)) + (Math.random() * 12 - 6),
        distance: 70 + Math.random() * 90,
        size: Math.random() * 6 + 10,
        color: sparkColors[i % sparkColors.length],
        char: chars[i % chars.length],
        delay: Math.random() * 0.08,
      }));

      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [transitionInfo?.timestamp]);

  if (!transitionInfo?.active) return null;

  const isToLight = transitionInfo.toTheme === 'light';
  const { x, y } = transitionInfo.origin;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99998] overflow-hidden"
    >
      {/* 1. Fullscreen SVG Shockwave Ripple Rings */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="waveGlowLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="waveGlowDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Primary Laser Wavefront */}
        <motion.circle
          key={`wave1-${transitionInfo.timestamp}`}
          cx={x}
          cy={y}
          initial={{ r: 0, opacity: 0.95, strokeWidth: 4 }}
          animate={{ r: maxRadius * 1.15, opacity: 0, strokeWidth: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          fill={isToLight ? 'url(#waveGlowLight)' : 'url(#waveGlowDark)'}
          stroke={isToLight ? '#f59e0b' : '#06b6d4'}
          className="filter drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] dark:drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
        />

        {/* Secondary Harmonic Wavefront */}
        <motion.circle
          key={`wave2-${transitionInfo.timestamp}`}
          cx={x}
          cy={y}
          initial={{ r: 0, opacity: 0.8, strokeWidth: 2 }}
          animate={{ r: maxRadius * 1.05, opacity: 0, strokeWidth: 0.5 }}
          transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          fill="none"
          stroke={isToLight ? '#0284c7' : '#8b5cf6'}
          strokeDasharray="8 6"
        />
      </svg>

      {/* 2. Sparkle Micro-Particles Radiating from Click Coordinates */}
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const targetX = Math.cos(rad) * p.distance;
        const targetY = Math.sin(rad) * p.distance;

        return (
          <motion.div
            key={`p-${p.id}-${transitionInfo.timestamp}`}
            initial={{
              x,
              y,
              scale: 0,
              opacity: 1,
              rotate: 0,
            }}
            animate={{
              x: x + targetX,
              y: y + targetY,
              scale: [0, 1.4, 0.8, 0],
              opacity: [1, 1, 0.8, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 0.55,
              delay: p.delay,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{
              color: p.color,
              fontSize: `${p.size}px`,
              textShadow: `0 0 10px ${p.color}`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none font-mono font-bold"
          >
            {p.char}
          </motion.div>
        );
      })}

      {/* 3. High-Tech Cyber HUD Telemetry Alert Banner */}
      <div className="absolute top-20 sm:top-24 inset-x-0 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: -24, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -16, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-xl border shadow-2xl ${
            isToLight
              ? 'bg-[#fdfcf9]/95 border-amber-500/30 text-stone-900 shadow-amber-500/10'
              : 'bg-[#07090e]/95 border-cyan-500/40 text-white shadow-cyan-500/20'
          }`}
        >
          {/* Animated Glowing Mode Orb */}
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              isToLight
                ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
            }`}
          >
            {isToLight ? (
              <Sun size={15} className="animate-spin" style={{ animationDuration: '8s' }} />
            ) : (
              <Moon size={15} className="animate-pulse" />
            )}
          </div>

          {/* Telemetry Text */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider uppercase">
                {isToLight ? 'Warm Daylight Mode' : 'Cyber Dark Terminal'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  isToLight ? 'bg-amber-500' : 'bg-cyan-400'
                }`}
              />
            </div>
            <span
              className={`text-[10px] font-mono tracking-tight font-medium ${
                isToLight ? 'text-stone-600' : 'text-slate-400'
              }`}
            >
              {isToLight
                ? 'Soft warm white canvas • High-contrast typography'
                : 'Low-luminance stealth matrix • Sandboxed sensors online'}
            </span>
          </div>

          {/* Mini Soundwave / Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-3.5 pl-1 shrink-0">
            <motion.span
              animate={{ height: ['40%', '100%', '30%'] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              className={`w-0.5 rounded-full ${isToLight ? 'bg-amber-500' : 'bg-cyan-400'}`}
            />
            <motion.span
              animate={{ height: ['80%', '30%', '90%'] }}
              transition={{ repeat: Infinity, duration: 0.45, ease: 'easeInOut' }}
              className={`w-0.5 rounded-full ${isToLight ? 'bg-amber-500' : 'bg-cyan-400'}`}
            />
            <motion.span
              animate={{ height: ['30%', '90%', '40%'] }}
              transition={{ repeat: Infinity, duration: 0.55, ease: 'easeInOut' }}
              className={`w-0.5 rounded-full ${isToLight ? 'bg-amber-500' : 'bg-cyan-400'}`}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
