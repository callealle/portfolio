"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number };

const NODE_COUNT = 46;
const LINK_DISTANCE = 150;

/**
 * Ambient node-network background -- plain 2D canvas, not WebGL. Adapted
 * from the idea behind ThreeUI's ConnectivityGraph/ConstellationField
 * (which, under the hood, are themselves 2D canvas effects, not Three.js),
 * reimplemented natively here so it shares our palette tokens, respects
 * reduced motion, and costs nothing extra on the GPU.
 */
export function NetworkField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const style = getComputedStyle(document.documentElement);
    const lineColor = style.getPropertyValue("--line-strong").trim() || "rgba(0,0,0,0.2)";
    const dotColors = [
      style.getPropertyValue("--accent").trim(),
      style.getPropertyValue("--accent-2").trim(),
      style.getPropertyValue("--accent-3").trim(),
    ].filter(Boolean);

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function step() {
      ctx!.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            ctx!.globalAlpha = (1 - dist / LINK_DISTANCE) * 0.5;
            ctx!.strokeStyle = lineColor;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      ctx!.globalAlpha = 0.8;
      nodes.forEach((n, i) => {
        ctx!.fillStyle = dotColors[i % dotColors.length] || "#888";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx!.fill();
      });

      raf = requestAnimationFrame(step);
    }

    resize();
    seed();

    if (prefersReduced) {
      step();
      cancelAnimationFrame(raf);
    } else {
      step();
    }

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`h-full w-full ${className ?? ""}`} />;
}
