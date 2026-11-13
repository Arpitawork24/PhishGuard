import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  MessageSquare,
  Globe,
  Server,
  LayoutDashboard,
  X,
  Radio,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings?: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Overview', icon: Shield, desc: 'Central Security Core & Constellation' },
    { id: 'message', label: 'Search Message', icon: MessageSquare, desc: 'Heuristic Phishing & Scam Scanner' },
    { id: 'url', label: 'URL Scanner', icon: Globe, desc: 'Domain, SSL & Sandboxing' },
    { id: 'ip', label: 'IP Info', icon: Server, desc: 'Live IPinfo.io Network Intelligence' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Threat Metrics & Incident Stream' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-end p-4 sm:p-6 lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 80, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg mx-auto rounded-3xl bg-[#fdfcf9] dark:bg-[#0c101a] border border-stone-200/90 dark:border-white/10 p-5 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/90 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-stone-900 dark:text-white">
                    PHISHGUARD<span className="text-cyan-600 dark:text-cyan-500">.AI</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-600 dark:text-slate-400 font-semibold">
                    NAVIGATION MENU
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/5 flex items-center justify-center text-stone-600 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation List */}
            <div className="space-y-1.5 mb-5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 font-bold'
                        : 'hover:bg-stone-100/80 dark:hover:bg-white/5 text-stone-800 dark:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-cyan-600 text-white'
                          : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate text-stone-900 dark:text-white">{item.label}</div>
                      <div className="text-[11px] text-stone-600 dark:text-slate-400 truncate font-medium">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-stone-200/90 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={(e) => toggleTheme(e)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-white/5 text-xs font-semibold text-stone-800 dark:text-slate-200 cursor-pointer hover:bg-stone-200/80 transition-colors"
              >
                {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-700" />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              {onOpenSettings && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-white/5 text-xs font-semibold text-stone-800 dark:text-slate-200 cursor-pointer hover:bg-stone-200/80 transition-colors"
                >
                  <Sliders size={14} />
                  <span>Config</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
