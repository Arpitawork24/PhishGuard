import React, { useEffect, useRef, useState } from 'react';
import { ConstellationNode, ThreatClassification } from '../../types';
import { Badge } from '../common/Badge';
import { ShieldAlert, Globe, MessageSquare, Server } from 'lucide-react';

interface ThreatConstellationProps {
  nodes: ConstellationNode[];
  onSelectNode?: (node: ConstellationNode) => void;
  className?: string;
}

export const ThreatConstellation: React.FC<ThreatConstellationProps> = ({
  nodes,
  onSelectNode,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{
    node: ConstellationNode;
    screenX: number;
    screenY: number;
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | ThreatClassification>('ALL');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Node state array with live simulation coordinates
    const liveNodes = nodes.map((n) => ({
      ...n,
      currentX: (n.x / 100) * width,
      currentY: (n.y / 100) * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // Find closest node within radius
      let found: ConstellationNode | null = null;
      for (const n of liveNodes) {
        if (activeFilter !== 'ALL' && n.classification !== activeFilter) continue;
        const dist = Math.hypot(n.currentX - mouseX, n.currentY - mouseY);
        if (dist < 18) {
          found = n;
          setHoveredNode({
            node: n,
            screenX: e.clientX - rect.left,
            screenY: e.clientY - rect.top,
          });
          break;
        }
      }
      if (!found) {
        setHoveredNode(null);
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      setHoveredNode(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update node positions
      liveNodes.forEach((n) => {
        n.currentX += n.vx;
        n.currentY += n.vy;

        // Bounce from walls
        if (n.currentX < 20 || n.currentX > width - 20) n.vx *= -1;
        if (n.currentY < 20 || n.currentY > height - 20) n.vy *= -1;
      });

      // Draw constellation links
      ctx.lineWidth = 0.8;
      for (let i = 0; i < liveNodes.length; i++) {
        const n1 = liveNodes[i];
        if (activeFilter !== 'ALL' && n1.classification !== activeFilter) continue;

        for (let j = i + 1; j < liveNodes.length; j++) {
          const n2 = liveNodes[j];
          if (activeFilter !== 'ALL' && n2.classification !== activeFilter) continue;

          const dist = Math.hypot(n1.currentX - n2.currentX, n1.currentY - n2.currentY);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle =
              n1.riskScore > 75 || n2.riskScore > 75
                ? `rgba(244, 63, 94, ${alpha})`
                : `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.currentX, n1.currentY);
            ctx.lineTo(n2.currentX, n2.currentY);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      liveNodes.forEach((n) => {
        const isDimmed = activeFilter !== 'ALL' && n.classification !== activeFilter;
        if (isDimmed) return;

        let nodeColor = 'rgb(16, 185, 129)'; // Safe
        let glowColor = 'rgba(16, 185, 129, 0.3)';

        if (n.classification === 'PHISHING' || n.classification === 'MALWARE') {
          nodeColor = 'rgb(244, 63, 94)';
          glowColor = 'rgba(244, 63, 94, 0.4)';
        } else if (n.classification === 'SUSPICIOUS' || n.classification === 'SCAM') {
          nodeColor = 'rgb(245, 158, 11)';
          glowColor = 'rgba(245, 158, 11, 0.35)';
        }

        const isHovered = hoveredNode?.node.id === n.id;
        const radius = isHovered ? n.radius * 1.5 : n.radius;

        // Outer halo
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(n.currentX, n.currentY, radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(n.currentX, n.currentY, radius, 0, Math.PI * 2);
        ctx.fill();

        // White specular center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(n.currentX - radius * 0.25, n.currentY - radius * 0.25, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [nodes, activeFilter, hoveredNode?.node.id]);

  return (
    <div ref={containerRef} className={`relative rounded-2xl overflow-hidden glass-panel ${className}`}>
      {/* Constellation Header & Filter Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ShieldAlert size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Threat Constellation</h3>
            <p className="text-xs text-slate-400">Live intelligence telemetry graph</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md pointer-events-auto text-xs">
          {(['ALL', 'PHISHING', 'SUSPICIOUS', 'SAFE'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-lg transition-all font-mono text-[11px] ${
                activeFilter === filter
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-[380px] sm:h-[440px] block cursor-crosshair" />

      {/* Interactive Tooltip on Node Hover */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-30 transition-transform duration-75"
          style={{
            left: `${Math.min(hoveredNode.screenX + 14, (containerRef.current?.clientWidth || 400) - 240)}px`,
            top: `${Math.max(hoveredNode.screenY - 80, 20)}px`,
          }}
        >
          <div className="p-3.5 rounded-xl bg-[#0a0f1d]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl w-56 text-xs text-slate-200">
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                {hoveredNode.node.type === 'MESSAGE' && <MessageSquare size={13} className="text-cyan-400" />}
                {hoveredNode.node.type === 'URL' && <Globe size={13} className="text-blue-400" />}
                {hoveredNode.node.type === 'IP' && <Server size={13} className="text-purple-400" />}
                <span className="font-mono text-[10px] uppercase text-slate-400">{hoveredNode.node.type}</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">{hoveredNode.node.timestamp}</span>
            </div>

            <div className="font-semibold text-white mb-2 truncate" title={hoveredNode.node.target}>
              {hoveredNode.node.target}
            </div>

            <div className="flex items-center justify-between">
              <Badge classification={hoveredNode.node.classification} size="sm" />
              <div className="flex items-baseline gap-1 font-mono text-xs">
                <span className="text-slate-400">Risk:</span>
                <span
                  className={`font-bold ${
                    hoveredNode.node.riskScore > 75
                      ? 'text-rose-400'
                      : hoveredNode.node.riskScore > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {hoveredNode.node.riskScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Phishing / Malware
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Suspicious / Scam
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified Safe
          </span>
        </div>
        <span className="hidden sm:inline">Hover nodes to inspect telemetry</span>
      </div>
    </div>
  );
};
