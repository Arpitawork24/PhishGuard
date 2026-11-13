import React from 'react';
import { IpAnalysisResult } from '../../types';
import { IPLocation } from './IPLocation';
import { IPDetails } from './IPDetails';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { RotateCcw } from 'lucide-react';

interface IPInfoResultProps {
  result: IpAnalysisResult;
  onReset: () => void;
}

export const IPInfoResult: React.FC<IPInfoResultProps> = ({ result, onReset }) => {
  const getGlow = (classification: string) => {
    if (classification === 'SAFE') return 'safe' as const;
    if (classification === 'SUSPICIOUS') return 'warning' as const;
    return 'danger' as const;
  };

  const glowType = getGlow(result.classification);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Globe Visualization Column */}
        <div className="lg:col-span-5 flex flex-col">
          <IPLocation
            coordinates={result.coordinates}
            city={result.city}
            region={result.region}
            country={result.country}
            classification={result.classification}
            glow={glowType}
          />
        </div>

        {/* IP Profile Details Column */}
        <div className="lg:col-span-7 flex flex-col">
          <GlassCard glow={glowType} className="flex-1 flex flex-col justify-between p-6">
            <IPDetails result={result} />

            <div className="pt-5 mt-5 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                icon={<RotateCcw size={14} />}
                onClick={onReset}
              >
                Lookup Another IP
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
