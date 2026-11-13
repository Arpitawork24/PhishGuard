import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  z: number; // depth layer: 1 (far/small), 2 (mid), 3 (near/large)
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
}

interface ParticleFieldProps {
  className?: string;
  density?: 'low' | 'normal' | 'high';
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  className = '',
  density = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const count = isMobile
      ? 24
      : density === 'low'
      ? 35
      : density === 'high'
      ? 75
      : 48;

    // Initialize particles across depth layers
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const z = Math.floor(Math.random() * 3) + 1;
      const speedScale = z === 3 ? 0.4 : z === 2 ? 0.25 : 0.15;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * speedScale,
        vy: (Math.random() - 0.5) * speedScale,
        size: z === 3 ? 2.2 : z === 2 ? 1.5 : 1.0,
        baseAlpha: z === 3 ? 0.45 : z === 2 ? 0.3 : 0.18,
      });
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const particleColor = isDark ? '6, 182, 212' : '14, 116, 144'; // cyan-500 vs cyan-700
      const lineColor = isDark ? '56, 189, 248' : '2, 132, 199';

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cursor attraction / repulsion
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.x -= (dx / dist) * force * 0.8;
            p.y -= (dy / dist) * force * 0.8;
          }
        }

        // Standard physics drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries with soft buffer
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Subtle edge fade calculation
        const edgeDistX = Math.min(p.x, width - p.x);
        const edgeDistY = Math.min(p.y, height - p.y);
        const edgeFactor = Math.min(1, Math.min(edgeDistX, edgeDistY) / 60);
        const alpha = p.baseAlpha * edgeFactor;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${alpha})`;
        ctx.fill();

        // Connect nearby particles on similar or adjacent depth layers
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (Math.abs(p.z - p2.z) > 1) continue;

          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = isMobile ? 65 : 95;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (alpha * 0.5);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
