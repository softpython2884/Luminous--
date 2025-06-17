
"use client";

import React, { useMemo } from 'react';

interface CustomCursorProps {
  cursorPosition: { x: number | null; y: number | null };
}

const NUM_CURSOR_PARTICLES_OUTER = 8; // Particles for the luminous zone
const CURSOR_RADIUS_OUTER = 10;      // Radius for the luminous zone particles
const NUCLEUS_SIZE = 3;             // Size of the central nucleus particle in px

const CustomCursor: React.FC<CustomCursorProps> = ({ cursorPosition }) => {
  const outerParticles = useMemo(() => {
    return Array.from({ length: NUM_CURSOR_PARTICLES_OUTER }).map((_, i) => {
      const angle = (i / NUM_CURSOR_PARTICLES_OUTER) * 2 * Math.PI;
      const x = CURSOR_RADIUS_OUTER * Math.cos(angle);
      const y = CURSOR_RADIUS_OUTER * Math.sin(angle);
      const animationDelay = `${Math.random() * 1}s`;
      return { id: `outer-${i}`, x, y, animationDelay };
    });
  }, []);

  if (cursorPosition.x === null || cursorPosition.y === null) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      {/* Nucleus Particle */}
      <div
        className="cursor-nucleus-particle"
        style={{
          width: `${NUCLEUS_SIZE}px`,
          height: `${NUCLEUS_SIZE}px`,
          transform: `translate(-50%, -50%)`, // Positioned at the center
        }}
      />
      {/* Luminous Zone Particles */}
      {outerParticles.map(p => (
        <div
          key={p.id}
          className="cursor-particle-element"
          style={{
            transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
};

export default CustomCursor;
