
"use client";

import React, { useMemo } from 'react';

interface CustomCursorProps {
  cursorPosition: { x: number | null; y: number | null };
}

const NUM_CURSOR_PARTICLES = 10; // Increased for a denser orb
const CURSOR_RADIUS = 12; // Slightly reduced for a more compact orb

const CustomCursor: React.FC<CustomCursorProps> = ({ cursorPosition }) => {
  const particles = useMemo(() => {
    return Array.from({ length: NUM_CURSOR_PARTICLES }).map((_, i) => {
      const angle = (i / NUM_CURSOR_PARTICLES) * 2 * Math.PI;
      const x = CURSOR_RADIUS * Math.cos(angle);
      const y = CURSOR_RADIUS * Math.sin(angle);
      const animationDelay = `${Math.random() * 1}s`;
      return { id: i, x, y, animationDelay };
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
      {particles.map(p => (
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
