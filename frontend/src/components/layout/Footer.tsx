import React from 'react';
import { Shield, Lock, Terminal, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-stone-200/90 dark:border-white/[0.06] bg-stone-100/90 dark:bg-[#05070b]/80 backdrop-blur-xl text-stone-700 dark:text-slate-400 text-xs py-10 px-6 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Shield size={14} />
          </div>
          <div>
            <span className="font-bold text-stone-900 dark:text-white tracking-wide">PHISHGUARD AI</span>
            <span className="ml-2 font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-semibold">v2.4-CORE</span>
            <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-0.5 font-medium">
              Next-generation autonomous threat detection & credential defense architecture.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] text-stone-700 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Lock size={12} className="text-emerald-600 dark:text-emerald-400" /> End-to-End Encrypted Sandbox
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu size={12} className="text-cyan-600 dark:text-cyan-400" /> Neural Classifier Online
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal size={12} className="text-purple-600 dark:text-purple-400" /> Zero Real Network Leakage
          </span>
        </div>
      </div>
    </footer>
  );
};
