"use client";

import { useEffect, useRef } from "react";

export default function ParticleWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const COLS = 120;
    const ROWS = 60;
    const DOT_SIZE = 1.5;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacingX = canvas.width / COLS;
      const spacingY = canvas.height / ROWS;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x = col * spacingX;
          const baseY = row * spacingY;

          // Multiple sine waves for organic wave motion
          const wave1 = Math.sin(col * 0.08 + time * 0.8) * 20;
          const wave2 = Math.sin(col * 0.04 + row * 0.06 + time * 0.5) * 15;
          const wave3 = Math.cos(row * 0.05 + time * 0.3) * 10;

          const y = baseY + wave1 + wave2 + wave3;

          // Opacity based on wave displacement
          const displacement = Math.abs(wave1 + wave2 + wave3);
          const normalizedDisplacement = displacement / 45;
          const opacity = 0.05 + normalizedDisplacement * 0.45;

          // Brighter near the top-left wave crest area
          const distFromCenter = Math.sqrt(
            Math.pow(col / COLS - 0.3, 2) + Math.pow(row / ROWS - 0.35, 2)
          );
          const focusFactor = Math.max(0, 1 - distFromCenter * 1.5);

          const finalOpacity = Math.min(1, opacity * (0.4 + focusFactor * 0.8));

          ctx.beginPath();
          ctx.arc(x, y, DOT_SIZE, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 200, 200, ${finalOpacity})`;
          ctx.fill();
        }
      }

      time += 0.015;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
