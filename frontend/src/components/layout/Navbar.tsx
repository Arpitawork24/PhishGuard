import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { MobileMenu } from './MobileMenu';
import {
  Shield,
  MessageSquare,
  Globe,
  Server,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  Radio,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Shield },
    { id: 'message', label: 'Search Message', icon: MessageSquare },
    { id: 'url', label: 'URL Scanner', icon: Globe },
    { id: 'ip', label: 'IP Info', icon: Server },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
      <nav className="max-w-6xl mx-auto rounded-2xl bg-[#fdfcf9]/95 dark:bg-[#07090e]/85 backdrop-blur-xl border border-stone-200/90 dark:border-white/10 px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto shadow-lg shadow-stone-300/30 dark:shadow-2xl transition-all">
        {/* Brand Logo & Telemetry Indicator */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Shield size={18} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-sm sm:text-base text-stone-900 dark:text-white">
                PHISHGUARD<span className="text-cyan-600 dark:text-cyan-400">.AI</span>
              </span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-stone-600 dark:text-slate-400 uppercase font-semibold hidden sm:block">
              CYBER INTELLIGENCE
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-black/25 border border-stone-200/90 dark:border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ffffff] dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-stone-200 dark:border-cyan-500/40 shadow-sm font-bold'
                    : 'text-stone-700 dark:text-slate-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-stone-500 dark:text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Animated Theme Toggle, Settings, Engine Status */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live Engine Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
            <Radio size={11} className="animate-pulse" />
            <span>Engines Online</span>
          </div>

          {/* Animated Theme Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            onClick={(e) => toggleTheme(e)}
            aria-label="Toggle dark/light theme"
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-stone-200/90 dark:border-white/10 text-stone-800 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer relative shadow-sm hover:shadow-md group"
          >
            {/* Ambient aura glow on hover */}
            <div
              className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none ${
                theme === 'dark' ? 'bg-amber-400/20' : 'bg-cyan-500/20'
              }`}
            />

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -18, opacity: 0, rotate: -70, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                exit={{ y: 18, opacity: 0, rotate: 70, scale: 0.6 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                className="flex items-center justify-center relative z-10"
              >
                {theme === 'dark' ? (
                  <Sun size={16} className="text-amber-400 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                ) : (
                  <Moon size={16} className="text-indigo-700 filter drop-shadow-[0_0_6px_rgba(67,56,202,0.3)]" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Settings Trigger */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              aria-label="Configuration"
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-stone-200/90 dark:border-white/10 text-stone-800 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer hidden sm:flex"
            >
              <Sliders size={14} />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            className="lg:hidden w-8 h-8 rounded-xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200/90 dark:border-white/10 text-stone-800 dark:text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <Menu size={17} />
          </button>
        </div>
      </nav>

      {/* Dedicated Mobile Menu Modal */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentTab={currentTab}
        onSelectTab={handleNavClick}
        onOpenSettings={onOpenSettings}
      />
    </header>
  );
};
