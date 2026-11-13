import React, { useEffect, useRef } from 'react';
import { ThreatClassification } from '../../types';

interface ThreatGlobeProps {
  coordinates?: { lat: number; lng: number };
  classification?: ThreatClassification;
  interactive?: boolean;
  className?: string;
}

export const ThreatGlobe: React.FC<ThreatGlobeProps> = ({
  coordinates = { lat: 50.1109, lng: 8.6821 },
  classification = 'SAFE',
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate Globe Latitude / Longitude lines & sample global nodes
    const globeRadius = Math.min(width, height) * 0.38;
    const globeNodes: Array<{ lat: number; lng: number; size: number }> = [];

    // Dense globe dot matrix
    for (let lat = -80; lat <= 80; lat += 12) {
      const radiusAtLat = Math.cos((lat * Math.PI) / 180);
      const count = Math.max(4, Math.floor(28 * radiusAtLat));
      for (let i = 0; i < count; i++) {
        globeNodes.push({
          lat,
          lng: (i / count) * 360 - 180,
          size: 1.2,
        });
      }
    }

    let rotationY = 0;
    let pulseWave = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      rotationY += 0.007;
      pulseWave = (pulseWave + 0.04) % (Math.PI * 2);

      // Subtle atmospheric halo around globe
      const haloGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.8,
        centerX,
        centerY,
        globeRadius * 1.3
      );
      haloGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
      haloGrad.addColorStop(0.6, 'rgba(99, 102, 241, 0.05)');
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Outer Ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Render latitude/longitude dots
      globeNodes.forEach((node) => {
        const phi = (node.lat * Math.PI) / 180;
        const theta = ((node.lng + rotationY * 60) * Math.PI) / 180;

        const x = globeRadius * Math.cos(phi) * Math.sin(theta);
        const y = -globeRadius * Math.sin(phi);
        const z = globeRadius * Math.cos(phi) * Math.cos(theta);

        // Only draw visible front hemisphere
        if (z > -10) {
          const depthAlpha = Math.max(0.08, (z + globeRadius * 0.2) / (globeRadius * 1.2));
          ctx.fillStyle = `rgba(148, 163, 184, ${depthAlpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(centerX + x, centerY + y, node.size * (z > 0 ? 1.2 : 0.8), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Target Coordinate Node
      const targetPhi = (coordinates.lat * Math.PI) / 180;
      const targetTheta = ((coordinates.lng + rotationY * 60) * Math.PI) / 180;

      const targetX = globeRadius * Math.cos(targetPhi) * Math.sin(targetTheta);
      const targetY = -globeRadius * Math.sin(targetPhi);
      const targetZ = globeRadius * Math.cos(targetPhi) * Math.cos(targetTheta);

      if (targetZ > -20) {
        const pinColor =
          classification === 'SAFE'
            ? 'rgb(16, 185, 129)'
            : classification === 'SUSPICIOUS'
            ? 'rgb(245, 158, 11)'
            : 'rgb(244, 63, 94)';

        // Expanding ping radar ring at target location
        const pingRadius = 6 + Math.sin(pulseWave) * 14;
        ctx.strokeStyle = pinColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = Math.max(0, 1 - Math.sin(pulseWave));
        ctx.beginPath();
        ctx.arc(centerX + targetX, centerY + targetY, pingRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Target center dot
        ctx.fillStyle = pinColor;
        ctx.beginPath();
        ctx.arc(centerX + targetX, centerY + targetY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX + targetX - 1, centerY + targetY - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Target line to HUD label
        ctx.strokeStyle = pinColor;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX + targetX, centerY + targetY);
        ctx.lineTo(centerX + targetX + 40, centerY + targetY - 30);
        ctx.lineTo(centerX + targetX + 90, centerY + targetY - 30);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${coordinates.lat.toFixed(2)}°N, ${coordinates.lng.toFixed(2)}°E`, centerX + targetX + 45, centerY + targetY - 35);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [coordinates, classification]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
