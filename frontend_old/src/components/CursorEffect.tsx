"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  hue: number;
  life: number;
  maxLife: number;
}

const CursorEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const cursorPos = useRef({ x: -200, y: -200 });
  const particles = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const lastEmit = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const spawnParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.2 + 0.2;
      const maxLife = Math.random() * 40 + 25;
      const hues = [180, 160, 200, 140, 210];
      const hue = hues[Math.floor(Math.random() * hues.length)];
      particles.current.push({
        x, y,
        size: Math.random() * 3.5 + 1,
        alpha: 1,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        hue,
        life: 0,
        maxLife,
      });
    };

    const isDark = () =>
      document.documentElement.classList.contains("dark");

    const loop = (timestamp: number) => {
      // Smooth cursor follow
      cursorPos.current.x += (mouse.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (mouse.current.y - cursorPos.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 10}px, ${cursorPos.current.y - 10}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mouse.current.x - 3}px, ${mouse.current.y - 3}px)`;
      }

      if (timestamp - lastEmit.current > 22) {
        spawnParticle(mouse.current.x, mouse.current.y);
        lastEmit.current = timestamp;
      }

      const dark = isDark();
      // Use screen blend on dark (makes glow pop), normal on light (stays visible)
      canvas.style.mixBlendMode = dark ? "screen" : "normal";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.life++;
        const t = p.life / p.maxLife;
        p.alpha = 1 - t;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        const currentSize = p.size * (1 - t * 0.6);

        // Lightness: bright on dark mode, dark/saturated on light mode
        const lightness = dark ? 70 : 40;
        const glowLightness = dark ? 55 : 30;

        ctx.save();
        ctx.globalAlpha = p.alpha * 0.85;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 2.5);
        grad.addColorStop(0, `hsla(${p.hue}, 90%, ${lightness}%, 1)`);
        grad.addColorStop(1, `hsla(${p.hue}, 90%, ${glowLightness}%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${dark ? 85 : 35}%, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return p.life < p.maxLife;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
      />

      {/* Outer glowing ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-5 h-5 rounded-full"
        style={{
          border: "1.5px solid rgba(6, 182, 212, 0.8)",
          boxShadow: "0 0 8px rgba(6, 182, 212, 0.5)",
          transition: "transform 0.06s linear",
          willChange: "transform",
        }}
      />

      {/* Inner sharp dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1.5 h-1.5 rounded-full"
        style={{
          background: "rgba(6, 182, 212, 1)",
          boxShadow: "0 0 6px rgba(6, 182, 212, 1)",
          willChange: "transform",
        }}
      />
    </>
  );
};

export default CursorEffect;
