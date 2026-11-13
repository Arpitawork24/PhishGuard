import React from 'react';
import { ThreatGlobe } from '../visualizations/ThreatGlobe';
import { ThreatClassification } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { MapPin, Info } from 'lucide-react';

interface IPLocationProps {
  coordinates?: { lat: number; lng: number };
  city?: string;
  region?: string;
  country?: string;
  classification: ThreatClassification;
  glow?: 'default' | 'cyan' | 'safe' | 'warning' | 'danger';
}

export const IPLocation: React.FC<IPLocationProps> = ({
  coordinates,
  city,
  region,
  country,
  classification,
  glow = 'default',
}) => {
  return (
    <GlassCard
      glow={glow}
      className="flex flex-col items-center justify-between p-6 text-center h-full"
    >
      <div className="w-full">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
            <MapPin size={13} />
            <span>Spatial Telemetry</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300">
            Approximate
          </span>
        </div>

        {/* 3D Globe Canvas / Coordinates visualizer */}
        <div className="w-full h-[280px] flex items-center justify-center my-1 relative">
          {coordinates ? (
            <ThreatGlobe
              coordinates={coordinates}
              classification={classification}
              interactive={true}
            />
          ) : (
            <div className="p-6 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 text-center max-w-xs">
              <MapPin size={24} className="mx-auto text-slate-400 mb-2" />
              <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                No Geographic Coordinates
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Specific coordinate telemetry is not published for this routing entity or private bogon range.
              </p>
            </div>
          )}
        </div>

        {/* Coordinate Readout */}
        <div className="mt-2 font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold">
          {[city, region, country].filter(Boolean).join(', ') || 'Global Network Entity'}
          {coordinates && (
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Lat: {coordinates.lat.toFixed(4)}° • Lng: {coordinates.lng.toFixed(4)}°
            </span>
          )}
        </div>
      </div>

      {/* Geolocation Accuracy Disclaimer Notice */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 text-left leading-tight w-full">
        <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
        <span>
          <strong>Approximate Location Notice:</strong> IP geolocation corresponds to the regional transit center or ISP routing node, not a precise physical residence or address.
        </span>
      </div>
    </GlassCard>
  );
};
