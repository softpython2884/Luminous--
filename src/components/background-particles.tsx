
"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface BackgroundParticle {
  id: string;
  x: number; // vw
  y: number; // vh
  size: number;
  initialOpacity: number;
  color: 'primary' | 'accent';
  animationDelay: string;
  animationDuration: string;
}

const NUM_BACKGROUND_PARTICLES = 35;

const BackgroundParticles: React.FC = () => {
  const [particles, setParticles] = useState<BackgroundParticle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const newParticles = Array.from({ length: NUM_BACKGROUND_PARTICLES }).map((_, i) => ({
      id: `bg-particle-${i}-${Date.now()}`,
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      size: Math.random() * 3 + 1.5, // 1.5px to 4.5px
      initialOpacity: Math.random() * 0.25 + 0.05, // 0.05 to 0.3
      color: Math.random() > 0.5 ? 'primary' : 'accent',
      animationDelay: `${Math.random() * 10}s`, // Staggered start
      animationDuration: `${Math.random() * 10 + 8}s`, // 8s to 18s pulse
    }));
    setParticles(newParticles);
  }, []);

  if (!isClient || !particles.length) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="background-particle" // Ensure this class is defined in globals.css
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `hsl(var(--${p.color}))`,
            opacity: p.initialOpacity, // Base opacity
            boxShadow: `0 0 ${p.size * 1.5}px hsl(var(--${p.color})), 0 0 ${p.size * 3}px hsl(var(--${p.color}))`,
            animationName: 'pulseFade',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            animationDirection: 'alternate',
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;
