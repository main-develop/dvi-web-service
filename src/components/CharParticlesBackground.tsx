"use client";

import { cn } from "@/src/lib/utils";
import type React from "react";
import { useEffect, useRef } from "react";

interface CharParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  characters?: string[];
}

type CharParticle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
  character: string;
  baseX: number;
  baseY: number;
  phaseX: number;
  phaseY: number;
  amplitudeX: number;
  amplitudeY: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
};

const DEFAULT_CHARACTERS = [
  "0", "0.4", "1", "1.2", "2", "2.6", "3", "3.1", "4", "5",
  "6", "7", "8", "9", "M", "F", "X", "Y",
];

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const hexInt = Number.parseInt(hex, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

const CharParticlesBackground: React.FC<CharParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  characters = DEFAULT_CHARACTERS,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<CharParticle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const animationTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const previousWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const createParticle = (): CharParticle => {
    const w = canvasSizeRef.current.w;
    const h = canvasSizeRef.current.h;

    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    const pSize = Math.floor(Math.random() * 8) + 10 + size * 10;

    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size: pSize,
      alpha: 0,
      targetAlpha: Number.parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
      character: characters[Math.floor(Math.random() * characters.length)],
      baseX: x,
      baseY: y,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      amplitudeX: 20 + Math.random() * 30,
      amplitudeY: 20 + Math.random() * 30,
      speedX: 0.05 + Math.random() * 0.005,
      speedY: 0.05 + Math.random() * 0.005,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
    };
  };

  const drawParticle = (p: CharParticle, update = false) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.save();
    ctx.translate(p.x + p.translateX, p.y + p.translateY);
    ctx.rotate(p.rotation);
    ctx.font = `${p.size}px`;
    ctx.fillStyle = `rgba(${hexToRgb(color).join(", ")}, ${p.alpha})`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.character, 0, 0);
    ctx.restore();

    if (!update) {
      particlesRef.current.push(p);
    }
  };

  const regenerateParticles = () => {
    const ctx = contextRef.current;
    if (!ctx) return;

    particlesRef.current.length = 0;

    ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);

    for (let i = 0; i < quantity; i++) {
      const p = createParticle();
      drawParticle(p);
    }
  };

  const resize = () => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!container || !canvas || !ctx) return;

    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight;

    const widthChangedSignificantly = Math.abs(newWidth - previousWidthRef.current) > 1;

    canvasSizeRef.current = { w: newWidth, h: newHeight };
    previousWidthRef.current = newWidth;

    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;

    ctx.scale(dpr, dpr);

    if (widthChangedSignificantly) {
      regenerateParticles();
    }
    // else: height-only change, just keep existing particles
  };

  // animation loop
  const animate = (timestamp: number) => {
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = timestamp;
    }

    const delta = (timestamp - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = timestamp;
    animationTimeRef.current += delta;

    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);

    particlesRef.current.forEach((p, i) => {
      // wave motion
      const tx = animationTimeRef.current * p.speedX + p.phaseX;
      const ty = animationTimeRef.current * p.speedY + p.phaseY;
      p.x = p.baseX + Math.sin(tx * Math.PI * 2) * p.amplitudeX;
      p.y = p.baseY + Math.sin(ty * Math.PI * 2) * p.amplitudeY;

      p.rotation += p.rotationSpeed * delta;

      p.baseX += p.dx + vx;
      p.baseY += p.dy + vy;

      // edge fade
      const distances = [
        p.x + p.translateX - p.size,
        canvasSizeRef.current.w - p.x - p.translateX - p.size,
        p.y + p.translateY - p.size,
        canvasSizeRef.current.h - p.y - p.translateY - p.size,
      ];
      const minDist = Math.min(...distances);
      const fade = Math.max(0, Math.min(1, minDist / 20));

      if (fade > 1) {
        p.alpha = Math.min(p.targetAlpha, p.alpha + 0.02);
      } else {
        p.alpha = p.targetAlpha * fade;
      }

      // mouse magnetism
      p.translateX += (mouseRef.current.x / (staticity / p.magnetism) - p.translateX) / ease;
      p.translateY += (mouseRef.current.y / (staticity / p.magnetism) - p.translateY) / ease;

      drawParticle(p, true);

      // recycle particles that drifted too far
      if (
        p.baseX < -p.size - p.amplitudeX ||
        p.baseX > canvasSizeRef.current.w + p.size + p.amplitudeX ||
        p.baseY < -p.size - p.amplitudeY ||
        p.baseY > canvasSizeRef.current.h + p.size + p.amplitudeY
      ) {
        particlesRef.current.splice(i, 1);
        const newP = createParticle();
        drawParticle(newP);
      }
    });

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    contextRef.current = canvas.getContext("2d");
    if (!contextRef.current) return;

    resize(); // initial setup

    rafRef.current = requestAnimationFrame(animate); // start animation

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + canvasSizeRef.current.w / 2;
      const cy = rect.top + canvasSizeRef.current.h / 2;

      const x = e.clientX - cx;
      const y = e.clientY - cy;

      if (Math.abs(x) < canvasSizeRef.current.w / 2 && Math.abs(y) < canvasSizeRef.current.h / 2) {
        mouseRef.current = { x, y };
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, quantity, size, staticity, ease, vx, vy, characters]);

  useEffect(() => {
    if (refresh) {
      regenerateParticles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

export { CharParticlesBackground };
