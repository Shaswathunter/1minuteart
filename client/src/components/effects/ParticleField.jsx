import { useMemo } from "react";
import { motion } from "motion/react";

const PARTICLES = 22;

export default function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }).map((_, index) => ({
        id: index,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 4
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-sky-300/55 blur-[1px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 6, 0],
            opacity: [0.2, 0.85, 0.2],
            scale: [1, 1.45, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
