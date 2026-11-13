import React, { useState, useEffect } from 'react';
import { SecurityCore } from '../components/visualizations/SecurityCore';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { ScanRings } from '../components/visualizations/ScanRings';
import {
  ShieldAlert,
  ArrowRight,
  MessageSquare,
  Globe,
  Server,
  CheckCircle2,
  ChevronDown,
  Fingerprint
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / 700));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      {/* Ambient background gradients */}
      <div className="ambient-hero absolute top-0 inset-x-0 h-[800px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-10">
        {/* Release / Classification Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-wide mb-6">
          <Fingerprint size={13} className="text-cyan-500 dark:text-cyan-400" />
          <span>AUTONOMOUS CYBER DEFENSE v2.4</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.1] mb-6">
          Protect Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">Digital World</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-light leading-relaxed mb-8">
          Intelligent threat detection for messages, URLs and digital identities. Analyze deceptive vectors before trust is compromised.
        </p>

        {/* Primary & Secondary Magnetic CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            variant="primary"
            magnetic={true}
            icon={<ShieldAlert size={18} />}
            onClick={() => onNavigate('message')}
          >
            Analyze a Message
          </Button>

          <Button
            size="lg"
            variant="secondary"
            magnetic={true}
            icon={<ArrowRight size={18} />}
            onClick={() => onNavigate('dashboard')}
          >
            Explore Intelligence
          </Button>
        </div>

        {/* Central Security Core Visualization */}
        <div className="relative w-full flex flex-col items-center justify-center my-4">
          <ScanRings active={true} size={420} color="rgba(6, 182, 212, 0.25)" />
          <SecurityCore
            state="idle"
            size="hero"
            scrollProgress={scrollProgress}
            interactive={true}
          />

          <div className="flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-stone-100/90 dark:bg-black/40 border border-stone-200/90 dark:border-white/10 text-[11px] font-mono text-stone-700 dark:text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-ping" />
            <span>Interactive Security Core: Hover & cursor responsive</span>
          </div>
        </div>

        {/* Scroll down prompt */}
        <div className="mt-8 flex flex-col items-center gap-2 text-stone-500 dark:text-slate-500 text-xs font-mono animate-bounce font-medium">
          <span>SCROLL TO DIVERGE INTELLIGENCE STREAMS</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* Cinematic Scroll Story Paths: Message, URL, IP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-28 relative z-10">
        <div className="text-center mb-16">
          <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 uppercase tracking-widest mb-2 font-bold">
            THREE CONVERGENT DETECTORS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
            Stream-Separated Threat Intelligence
          </h2>
          <p className="text-stone-700 dark:text-slate-400 text-sm max-w-xl mx-auto mt-2 font-normal">
            The central intelligence core separates incoming signals into specialized neural scanning pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Path 1: Message Analyzer */}
          <GlassCard
            tiltEnabled={true}
            interactive={true}
            onClick={() => onNavigate('message')}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-1 font-bold">
                PATH 01 • LINGUISTIC
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Message Analyzer</h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-400 leading-relaxed mb-6 font-normal">
                Detects urgent banking scams, executive impersonation (BEC), and psychological coercion in email and SMS texts.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200/90 dark:border-white/5 flex items-center justify-between text-xs font-bold text-cyan-700 dark:text-cyan-400">
              <span>Scan Suspicious Message</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>

          {/* Path 2: URL Intelligence */}
          <GlassCard
            tiltEnabled={true}
            interactive={true}
            onClick={() => onNavigate('url')}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <div className="font-mono text-[11px] text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1 font-bold">
                PATH 02 • WEBSITES
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">URL Scanner</h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-400 leading-relaxed mb-6 font-normal">
                Sandboxes destination hyperlinks, analyzes multi-hop redirects, SSL certificate chains, and newly registered domains.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200/90 dark:border-white/5 flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
              <span>Scan Target URL</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>

          {/* Path 3: IP Intelligence */}
          <GlassCard
            tiltEnabled={true}
            interactive={true}
            onClick={() => onNavigate('ip')}
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Server size={24} />
              </div>
              <div className="font-mono text-[11px] text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1 font-bold">
                PATH 03 • INFRASTRUCTURE
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">IP Intelligence</h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-400 leading-relaxed mb-6 font-normal">
                Identifies Tor exit relays, bulletproof hosting Autonomous Systems (ASNs), botnet command hubs, and abuse metrics.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-200/90 dark:border-white/5 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
              <span>Lookup Network IP</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Interactive Feature Highlights / Security Manifesto */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-28 relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#fdfcf9]/95 dark:bg-[#0c101a]/80 backdrop-blur-xl border border-stone-200/90 dark:border-white/10 shadow-lg shadow-stone-300/30 dark:shadow-none flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400 uppercase tracking-widest font-bold">
              AUTONOMOUS ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white tracking-tight mt-2 mb-4">
              Real-Time Synthetic Sandboxing
            </h2>
            <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed mb-6 font-normal">
              Unlike static signature scanners that fail against modern polymorphic attacks, PhishGuard AI evaluates semantic manipulation, DNS hopping, and zero-day staging behavior in seconds.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-stone-700 dark:text-slate-400 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Zero Trust Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Typo-Squatting Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>BEC Authority Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Tor / C2 Node Identification</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              magnetic={true}
              onClick={() => onNavigate('dashboard')}
            >
              Open Security Dashboard
            </Button>
            <span className="text-[11px] font-mono text-stone-600 dark:text-slate-500 text-center font-medium">
              Fully Local Frontend Evaluation Mode
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
