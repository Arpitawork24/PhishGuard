"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <motion.div 
      className="fixed inset-0 z-[-1] opacity-20 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 0.2
      }}
      transition={{ duration: 2 }}
    >
      {/* Floating cybersecurity orbs */}
      <motion.div 
        className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl top-1/4 left-10"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-violet-500/20 rounded-full blur-3xl top-2/3 right-20"
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -180, -360]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
      <motion.div 
        className="absolute w-48 h-48 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl bottom-1/4 left-1/2 -translate-x-1/2"
        animate={{ 
          scale: [1, 1.2, 1],
          y: [0, -15, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-slate-900/50 bg-grid" />
    </motion.div>
  );
}
