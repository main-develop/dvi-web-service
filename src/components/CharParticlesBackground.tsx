"use client";

import { cn } from "@/src/lib/utils";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

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
  "0",
  "0.4",
  "1",
  "1.2",
  "2",
  "2.6",
  "3",
  "3.1",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "M",
  "F",
  "X",
  "Y",
];

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = Number.parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;

  return [red, green, blue];
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
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const charParticles = useRef<CharParticle[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const animationTime = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const previousWidth = useRef<number>(0);

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    if (canvasContainerRef.current) {
      previousWidth.current = canvasContainerRef.current.offsetWidth;
    }
    animate();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawCharParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      charParticles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const resizeCanvasHeightOnly = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      const newHeight = canvasContainerRef.current.offsetHeight;
      canvasSize.current.h = newHeight;
      canvasRef.current.height = newHeight * dpr;
      canvasRef.current.style.height = `${newHeight}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const charParticleParams = (): CharParticle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 8) + 10 + size * 10;
    const alpha = 0;
    const targetAlpha = Number.parseFloat(
      (Math.random() * 0.6 + 0.1).toFixed(1)
    );
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    const character = characters[Math.floor(Math.random() * characters.length)];
    const baseX = x;
    const baseY = y;
    const phaseX = Math.random() * Math.PI * 2;
    const phaseY = Math.random() * Math.PI * 2;
    const amplitudeX = 20 + Math.random() * 30;
    const amplitudeY = 20 + Math.random() * 30;
    const speedX = 0.05 + Math.random() * 0.005;
    const speedY = 0.05 + Math.random() * 0.005;
    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() - 0.5) * 0.5; // radians per second

    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      character,
      baseX,
      baseY,
      phaseX,
      phaseY,
      amplitudeX,
      amplitudeY,
      speedX,
      speedY,
      rotation,
      rotationSpeed,
    };
  };

  const drawCharParticle = (charParticle: CharParticle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha, character, rotation } =
        charParticle;

      context.current.save();
      context.current.translate(x + translateX, y + translateY);
      context.current.rotate(rotation);
      context.current.font = `${size}px`;
      context.current.fillStyle = `rgba(${hexToRgb(color).join(
        ", "
      )}, ${alpha})`;
      context.current.textAlign = "center";
      context.current.textBaseline = "middle";
      context.current.fillText(character, 0, 0);
      context.current.restore();

      if (!update) {
        charParticles.current.push(charParticle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawCharParticles = () => {
    clearContext();

    const charParticleCount = quantity;
    for (let i = 0; i < charParticleCount; i++) {
      const charParticle = charParticleParams();
      drawCharParticle(charParticle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;

    return remapped > 0 ? remapped : 0;
  };

  const animate = (timestamp = 0) => {
    if (lastFrameTime.current === 0) {
      lastFrameTime.current = timestamp;
    }

    const deltaTime = (timestamp - lastFrameTime.current) / 1000; // convert to seconds
    lastFrameTime.current = timestamp;
    animationTime.current += deltaTime;

    clearContext();
    charParticles.current.forEach((charParticle: CharParticle, i: number) => {
      const timeX =
        animationTime.current * charParticle.speedX + charParticle.phaseX;
      const timeY =
        animationTime.current * charParticle.speedY + charParticle.phaseY;
      charParticle.x =
        charParticle.baseX +
        Math.sin(timeX * Math.PI * 2) * charParticle.amplitudeX;
      charParticle.y =
        charParticle.baseY +
        Math.sin(timeY * Math.PI * 2) * charParticle.amplitudeY;

      charParticle.rotation += charParticle.rotationSpeed * deltaTime;

      charParticle.baseX += charParticle.dx + vx;
      charParticle.baseY += charParticle.dy + vy;

      const edge = [
        charParticle.x + charParticle.translateX - charParticle.size,
        canvasSize.current.w -
          charParticle.x -
          charParticle.translateX -
          charParticle.size,
        charParticle.y + charParticle.translateY - charParticle.size,
        canvasSize.current.h -
          charParticle.y -
          charParticle.translateY -
          charParticle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = Number.parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );

      if (remapClosestEdge > 1) {
        charParticle.alpha += 0.02;
        if (charParticle.alpha > charParticle.targetAlpha) {
          charParticle.alpha = charParticle.targetAlpha;
        }
      } else {
        charParticle.alpha = charParticle.targetAlpha * remapClosestEdge;
      }

      charParticle.translateX +=
        (mouse.current.x / (staticity / charParticle.magnetism) -
          charParticle.translateX) /
        ease;
      charParticle.translateY +=
        (mouse.current.y / (staticity / charParticle.magnetism) -
          charParticle.translateY) /
        ease;

      drawCharParticle(charParticle, true);

      if (
        charParticle.baseX < -charParticle.size - charParticle.amplitudeX ||
        charParticle.baseX >
          canvasSize.current.w + charParticle.size + charParticle.amplitudeX ||
        charParticle.baseY < -charParticle.size - charParticle.amplitudeY ||
        charParticle.baseY >
          canvasSize.current.h + charParticle.size + charParticle.amplitudeY
      ) {
        charParticles.current.splice(i, 1);
        const newcharParticle = charParticleParams();
        drawCharParticle(newcharParticle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (canvasContainerRef.current) {
      const newWidth = canvasContainerRef.current.offsetWidth;
      if (Math.abs(newWidth - previousWidth.current) > 1) {
        previousWidth.current = newWidth;
        initCanvas();
      } else {
        resizeCanvasHeightOnly();
      }
    }
  };

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
