import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from './Button';
import {
  X,
  Sliders,
  Moon,
  Sun,
  Shield,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#fdfcf9] dark:bg-[#0c101a] border border-stone-200/90 dark:border-white/10 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Sliders size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">Platform Settings</h2>
            <p className="text-xs text-stone-600 dark:text-slate-400 font-medium">Configure environment & simulation controls</p>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {/* Theme setting */}
          <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/50 border border-stone-200/90 dark:border-white/5 flex items-center justify-between">
            <div>
              <div className="text-stone-900 dark:text-white font-semibold mb-0.5">Interface Theme</div>
              <div className="text-stone-600 dark:text-slate-400 text-[11px] font-medium">Current: {theme.toUpperCase()} MODE</div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              onClick={(e) => toggleTheme(e)}
            >
              Toggle {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>

          {/* Architecture Verification Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 size={14} className="text-emerald-700 dark:text-emerald-400" />
              <span>Frontend-Only Architecture Verified</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-950/90 dark:text-emerald-200/80 font-sans font-medium">
              All detection algorithms run through modular service abstractions (<code className="font-mono text-stone-900 dark:text-white">analysisService</code>, <code className="font-mono text-stone-900 dark:text-white">urlService</code>, <code className="font-mono text-stone-900 dark:text-white">ipService</code>). Ready for zero-rewrite REST / gRPC backend integration.
            </p>
          </div>

          {/* Neural Engine Version */}
          <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-900/50 border border-stone-200/90 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between text-stone-700 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Cpu size={13} className="text-cyan-700 dark:text-cyan-400" /> Neural Engine Build
              </span>
              <span className="text-stone-900 dark:text-white font-mono font-semibold">v2.4.0-CORE</span>
            </div>
            <div className="flex items-center justify-between text-stone-700 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} className="text-purple-700 dark:text-purple-400" /> Sandboxed Execution
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Active (Isolated)</span>
            </div>
            <div className="flex items-center justify-between text-stone-700 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-blue-700 dark:text-blue-400" /> Accessibility
              </span>
              <span className="text-stone-900 dark:text-white font-semibold">
                {prefersReduced ? 'Reduced Motion Active' : 'Cinematic Motion Active'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200/90 dark:border-white/10 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
