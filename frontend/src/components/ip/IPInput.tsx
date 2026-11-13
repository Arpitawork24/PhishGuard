import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { Search, Server, Sparkles, LocateFixed } from 'lucide-react';

interface IPInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  onSelectPreset: (ip: string) => void;
}

const PRESET_IPS = [
  { label: 'Google DNS', ip: '8.8.8.8' },
  { label: 'Cloudflare', ip: '1.1.1.1' },
  { label: 'Tor Exit Node', ip: '185.220.101.5' },
  { label: 'Twitter / X Net', ip: '104.244.42.1' },
];

export const IPInput: React.FC<IPInputProps> = ({
  value,
  onChange,
  onSubmit,
  loading,
  onSelectPreset,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() && !loading) {
      onSubmit();
    }
  };

  const handleMyIp = () => {
    onChange('');
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Preset Quick Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
            <Sparkles size={13} className="text-purple-500 dark:text-purple-400" />
            Preset Intelligence Targets
          </span>
          <button
            type="button"
            onClick={handleMyIp}
            className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-mono inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LocateFixed size={12} />
            <span>Detect My Current IP</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_IPS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPreset(preset.ip)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-white/5 hover:border-purple-500/40 text-xs font-mono text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer shadow-sm dark:shadow-none flex items-center gap-2"
            >
              <span className="font-semibold text-slate-900 dark:text-white">{preset.label}</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">{preset.ip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Bar */}
      <GlassCard className="p-4 sm:p-5 border-purple-500/20">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              id="ip-search-input"
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 8.8.8.8, 1.1.1.1, or leave blank for your IP..."
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-100/90 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-purple-500 dark:focus:border-purple-400/60 transition-colors"
              disabled={loading}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <Button
            id="ip-lookup-submit"
            variant="primary"
            size="lg"
            magnetic={true}
            onClick={onSubmit}
            disabled={loading}
            icon={<Server size={16} />}
            className="w-full sm:w-auto shrink-0"
          >
            {loading ? 'Querying...' : 'Lookup IP'}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
