import React from 'react';
import { motion } from 'motion/react';

interface ScanRingsProps {
  active?: boolean;
  color?: string;
  size?: number;
}

export const ScanRings: React.FC<ScanRingsProps> = ({
  active = true,
  color = 'rgba(56, 189, 248, 0.4)',
  size = 320,
}) => {
  if (!active) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Outer Pulse Ring */}
      <motion.div
        animate={{
          scale: [0.8, 1.4, 1.9],
          opacity: [0.6, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        style={{
          width: size,
          height: size,
          borderColor: color,
        }}
        className="absolute rounded-full border border-dashed"
      />

      {/* Secondary Pulse Ring */}
      <motion.div
        animate={{
          scale: [0.9, 1.5, 2.1],
          opacity: [0.5, 0.25, 0],
        }}
        transition={{
          duration: 3,
          delay: 1.2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderColor: color,
        }}
        className="absolute rounded-full border border-dotted"
      />

      {/* Rotating Radar Crosshairs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        style={{ width: size * 1.1, height: size * 1.1 }}
        className="absolute rounded-full border border-white/[0.04]"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-cyan-400/40" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-cyan-400/40" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-3 bg-cyan-400/40" />
      </motion.div>
    </div>
  );
};
