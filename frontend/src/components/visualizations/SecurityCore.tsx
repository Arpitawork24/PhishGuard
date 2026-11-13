import React, { useEffect, useRef } from 'react';
import { ThreatClassification } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SecurityCoreProps {
  state?: 'idle' | 'scanning' | 'result';
  resultClassification?: ThreatClassification | null;
  scrollProgress?: number; // 0 to 1 for continuous hero narrative
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  showRings?: boolean;
}

interface Particle3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  alpha: number;
  speed: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  category?: 'core' | 'shield' | 'stream' | 'ambient';
  pathIndex?: number; // 0: message, 1: url, 2: ip
}

export const SecurityCore: React.FC<SecurityCoreProps> = ({
  state = 'idle',
  resultClassification = null,
  scrollProgress = 0,
  interactive = true,
  size = 'hero',
  className = '',
  showRings = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const reducedMotion = useReducedMotion();

  // Color profiles based on status
  const getColorScheme = () => {
    if (state === 'scanning') {
      return {
        primary: 'rgb(56, 189, 248)',
        secondary: 'rgb(99, 102, 241)',
        glow: 'rgba(56, 189, 248, 0.4)',
        turbulence: 2.2,
      };
    }
    if (state === 'result' && resultClassification) {
      switch (resultClassification) {
        case 'SAFE':
          return {
            primary: 'rgb(16, 185, 129)',
            secondary: 'rgb(52, 211, 153)',
            glow: 'rgba(16, 185, 129, 0.4)',
            turbulence: 0.3,
          };
        case 'SUSPICIOUS':
          return {
            primary: 'rgb(245, 158, 11)',
            secondary: 'rgb(251, 191, 36)',
            glow: 'rgba(245, 158, 11, 0.4)',
            turbulence: 1.8,
          };
        case 'PHISHING':
          return {
            primary: 'rgb(244, 63, 94)',
            secondary: 'rgb(225, 29, 72)',
            glow: 'rgba(244, 63, 94, 0.55)',
            turbulence: 3.5,
          };
        case 'SCAM':
          return {
            primary: 'rgb(249, 115, 22)',
            secondary: 'rgb(234, 88, 12)',
            glow: 'rgba(249, 115, 22, 0.45)',
            turbulence: 2.8,
          };
        case 'MALWARE':
          return {
            primary: 'rgb(239, 68, 68)',
            secondary: 'rgb(185, 28, 28)',
            glow: 'rgba(239, 68, 68, 0.65)',
            turbulence: 4.2,
          };
      }
    }
    // Idle state
    return {
      primary: 'rgb(6, 182, 212)',
      secondary: 'rgb(139, 92, 246)',
      glow: 'rgba(6, 182, 212, 0.3)',
      turbulence: 0.8,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for subtle parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initialize 3D particle collection
    const PARTICLE_COUNT = size === 'sm' ? 120 : size === 'md' ? 220 : 380;
    const particles: Particle3D[] = [];

    // Shield contour generator
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isCore = i < PARTICLE_COUNT * 0.45;
      const isShield = !isCore && i < PARTICLE_COUNT * 0.85;
      const category = isCore ? 'core' : isShield ? 'shield' : 'ambient';

      let baseX = 0;
      let baseY = 0;
      let baseZ = 0;

      if (isCore) {
        // Fibonnaci sphere for core
        const phi = Math.acos(1 - (2 * (i + 0.5)) / (PARTICLE_COUNT * 0.45));
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const radius = 65 + Math.sin(i * 3) * 8;
        baseX = radius * Math.sin(phi) * Math.cos(theta);
        baseY = radius * Math.cos(phi);
        baseZ = radius * Math.sin(phi) * Math.sin(theta);
      } else if (isShield) {
        // Geometric shield lattice
        const t = (i / (PARTICLE_COUNT * 0.4)) * Math.PI * 2;
        const shieldWidth = 110 * (1 - Math.pow(Math.sin(t / 2), 2) * 0.4);
        const shieldHeight = 135 * Math.cos(t / 2);
        baseX = Math.cos(t) * shieldWidth;
        baseY = shieldHeight;
        baseZ = Math.sin(t) * 45;
      } else {
        // Outer floating energy envelope
        const dist = 140 + Math.random() * 90;
        const angle = Math.random() * Math.PI * 2;
        const hAngle = (Math.random() - 0.5) * Math.PI;
        baseX = dist * Math.cos(angle) * Math.cos(hAngle);
        baseY = dist * Math.sin(hAngle);
        baseZ = dist * Math.sin(angle) * Math.cos(hAngle);
      }

      particles.push({
        baseX,
        baseY,
        baseZ,
        x: baseX,
        y: baseY,
        z: baseZ,
        size: isCore ? 1.8 + Math.random() * 1.5 : 1.2 + Math.random() * 1.8,
        color: isCore ? 'rgba(56, 189, 248, 0.85)' : 'rgba(139, 92, 246, 0.7)',
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.008 + Math.random() * 0.015,
        orbitRadius: Math.hypot(baseX, baseZ),
        orbitAngle: Math.atan2(baseZ, baseX),
        orbitSpeed: (Math.random() - 0.5) * 0.01,
        category,
        pathIndex: i % 3, // 0: Message path, 1: URL path, 2: IP path
      });
    }

    let angleY = 0;
    let angleX = 0;
    let pulsePhase = 0;
    let scanRingRadius = 0;

    const render = () => {
      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      // When scrolling, smoothly translate the core down into the center flow
      const centerY = height / 2 + scrollProgress * 40;

      const scheme = getColorScheme();
      const currentTurbulence = scheme.turbulence;

      // Rotation angles with mouse parallax
      const baseRotationSpeed = reducedMotion ? 0.002 : state === 'scanning' ? 0.025 : 0.008;
      angleY += baseRotationSpeed + scrollProgress * 0.01;
      angleX = mouseRef.current.y * 0.25;
      const targetYAngle = angleY + mouseRef.current.x * 0.35;

      pulsePhase += 0.035;
      const pulseScale = 1 + Math.sin(pulsePhase) * 0.04;

      // Central volumetric glow
      const radialGlow = ctx.createRadialGradient(
        centerX + mouseRef.current.x * 20,
        centerY + mouseRef.current.y * 20,
        10,
        centerX,
        centerY,
        size === 'hero' ? 220 : 130
      );
      radialGlow.addColorStop(0, scheme.glow);
      radialGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size === 'hero' ? 240 : 140, 0, Math.PI * 2);
      ctx.fill();

      // Scanning wave rings
      if (state === 'scanning' && showRings) {
        scanRingRadius = (scanRingRadius + 2.2) % 180;
        ctx.save();
        ctx.strokeStyle = scheme.primary;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, scanRingRadius * 1.4, scanRingRadius * 0.8, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = scheme.secondary;
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, (scanRingRadius * 1.1) % 180 * 1.2, ((scanRingRadius * 1.1) % 180) * 0.7, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Projection parameters
      const fov = 340;

      // Sort particles by projected Z for correct painter's algorithm
      const projectedList: Array<{
        px: number;
        py: number;
        scale: number;
        alpha: number;
        size: number;
        color: string;
        isCore: boolean;
      }> = [];

      // Scroll separation factor (separates into 3 streams as requested in STEP 4 & 5)
      const separation = Math.min(Math.max(scrollProgress * 1.8, 0), 1);

      particles.forEach((p) => {
        // Orbit update
        p.orbitAngle += p.orbitSpeed;
        let x0 = p.baseX;
        let y0 = p.baseY;
        let z0 = p.baseZ;

        // Add state-based turbulence
        if (currentTurbulence > 1) {
          x0 += Math.sin(pulsePhase * 3 + p.baseY) * currentTurbulence * 3;
          y0 += Math.cos(pulsePhase * 2 + p.baseX) * currentTurbulence * 3;
          z0 += Math.sin(pulsePhase * 2.5 + p.baseZ) * currentTurbulence * 3;
        }

        // Apply scroll-driven 3-path separation (Step 5: Message, URL, IP streams)
        if (separation > 0.05) {
          const pathAngle = (p.pathIndex || 0) * ((Math.PI * 2) / 3) + Math.PI / 2;
          const streamDist = separation * 180;
          x0 += Math.cos(pathAngle) * streamDist;
          y0 += Math.sin(pathAngle) * streamDist * 0.5 + separation * 60;
        }

        // Apply pulse scale
        x0 *= pulseScale;
        y0 *= pulseScale;
        z0 *= pulseScale;

        // 3D Rotation Matrix around Y and X axes
        // Rotate Y
        const cosY = Math.cos(targetYAngle);
        const sinY = Math.sin(targetYAngle);
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = z0 * cosY + x0 * sinY;

        // Rotate X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = z1 * cosX + y0 * sinX;

        // Perspective Projection
        const zDistance = z2 + 420;
        if (zDistance > 20) {
          const scale = fov / zDistance;
          const px = centerX + x1 * scale;
          const py = centerY + y2 * scale;
          const alpha = Math.max(0.1, Math.min(1, ((z2 + 180) / 360) * p.alpha));

          projectedList.push({
            px,
            py,
            scale,
            alpha,
            size: p.size * scale,
            color: p.category === 'core' ? scheme.primary : scheme.secondary,
            isCore: p.category === 'core',
          });
        }
      });

      // Render connecting lattice lines between nearest core particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projectedList.length; i += 6) {
        const p1 = projectedList[i];
        if (!p1.isCore) continue;
        for (let j = i + 1; j < Math.min(i + 8, projectedList.length); j++) {
          const p2 = projectedList[j];
          if (!p2.isCore) continue;
          const dist = Math.hypot(p1.px - p2.px, p1.py - p2.py);
          if (dist < 42) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 42) * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      projectedList.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(p.size, 0.8), 0, Math.PI * 2);
        ctx.fill();

        // Extra specular glint on closer core nodes
        if (p.isCore && p.alpha > 0.75) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.px - p.size * 0.3, p.py - p.size * 0.3, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [state, resultClassification, scrollProgress, interactive, size, reducedMotion, showRings]);

  const dimensionClasses = {
    sm: 'w-[240px] h-[240px]',
    md: 'w-[360px] h-[360px]',
    lg: 'w-[480px] h-[480px]',
    hero: 'w-full max-w-[540px] h-[440px] sm:h-[500px] md:h-[540px]',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dimensionClasses} ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
      />
    </div>
  );
};
