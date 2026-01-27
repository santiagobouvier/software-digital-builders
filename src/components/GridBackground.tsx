import { useEffect, useRef } from "react";

export const GridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gridSize = 80;
    const dots: { x: number; y: number; opacity: number; speed: number }[] = [];

    // Create dots at grid intersections
    for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
      for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
        dots.push({
          x,
          y,
          opacity: Math.random() * 0.3 + 0.1,
          speed: Math.random() * 0.02 + 0.005,
        });
      }
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(0, 217, 255, 0.03)";
      ctx.lineWidth = 1;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animate dots with pulsing glow
      dots.forEach((dot) => {
        const pulse = Math.sin(time * dot.speed * 100 + dot.x * 0.01 + dot.y * 0.01) * 0.5 + 0.5;
        const opacity = dot.opacity * pulse;

        // Glow effect
        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 20);
        gradient.addColorStop(0, `rgba(0, 217, 255, ${opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(0, 217, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(0, 217, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Moving glow wave
      const waveY = ((time * 50) % (canvas.height + 400)) - 200;
      const waveGradient = ctx.createLinearGradient(0, waveY - 100, 0, waveY + 100);
      waveGradient.addColorStop(0, "transparent");
      waveGradient.addColorStop(0.5, "rgba(0, 217, 255, 0.05)");
      waveGradient.addColorStop(1, "transparent");

      ctx.fillStyle = waveGradient;
      ctx.fillRect(0, waveY - 100, canvas.width, 200);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
