import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
}

export const Starfield = () => {
  const stars = useMemo<Star[]>(() => {
    const starCount = 80;
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`,
            animationDelay: `${star.animationDelay}s`,
          }}
        />
      ))}

      {/* Subtle nebula/space glow */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, hsl(260 80% 60%) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, hsl(200 80% 50%) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] opacity-[0.02]"
        style={{
          background: "radial-gradient(circle, hsl(320 70% 50%) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};
