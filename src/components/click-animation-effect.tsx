
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { getShapePoints, Point, ShapeType } from '@/lib/shapes';

interface ClickAnimationEffectProps {
  id: string;
  x: number;
  y: number;
  shapeType: ShapeType;
  onComplete: (id: string) => void;
}

interface ParticleState extends Point {
  id: string;
  size: number;
  color: string; // 'primary' or 'accent'
  opacity: number;
  scale: number;
  rotation: number; // Individual particle rotation, can be 0
  // For animation
  destX: number; 
  destY: number;
  delay: number; // Animation delay
}

const TOTAL_ANIMATION_DURATION = 1500; // ms
const FADE_IN_DURATION = 300; // ms
const HOLD_DURATION = 400; // ms
// FADE_OUT_DURATION is TOTAL_ANIMATION_DURATION - FADE_IN_DURATION - HOLD_DURATION

const ClickAnimationEffect: React.FC<ClickAnimationEffectProps> = ({ id, x, y, shapeType, onComplete }) => {
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [overallRotation, setOverallRotation] = useState(0);

  useEffect(() => {
    const shapePoints = getShapePoints(shapeType);
    const newParticles: ParticleState[] = shapePoints.map((p, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const dispersionRadius = 80 + Math.random() * 50; // How far particles disperse
      return {
        id: `particle-${id}-${i}`,
        x: p.x, // Initial position relative to shape center
        y: p.y,
        size: Math.random() * 4 + 4, // 4px to 8px
        color: Math.random() > 0.3 ? 'primary' : 'accent',
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360, // Random initial rotation for particles
        destX: p.x + dispersionRadius * Math.cos(angle), // Final dispersed position
        destY: p.y + dispersionRadius * Math.sin(angle),
        delay: Math.random() * 200, // Staggered appearance
      };
    });
    setParticles(newParticles);

    // Animate in
    const fadeInTimer = setTimeout(() => {
      setParticles(prev => prev.map(p => ({ ...p, opacity: 1, scale: 1 })));
      setOverallRotation(Math.random() * 60 - 30); // Rotate the whole shape slightly
    }, 50); // Small delay to allow initial state to render

    // Animate out
    const fadeOutTimer = setTimeout(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.destX, // Move to dispersed position
        y: p.destY,
        opacity: 0,
        scale: 0.3 + Math.random() * 0.4, // Shrink to smaller size
      })));
      setOverallRotation(prev => prev + Math.random() * 60 - 30);
    }, FADE_IN_DURATION + HOLD_DURATION);
    
    const completeTimer = setTimeout(() => {
      onComplete(id);
    }, TOTAL_ANIMATION_DURATION);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [id, shapeType, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-[9998]"
      style={{
        top: y,
        left: x,
        transform: `translate(-50%, -50%) rotate(${overallRotation}deg)`,
        transition: `transform ${TOTAL_ANIMATION_DURATION}ms ease-out`,
      }}
      aria-hidden="true"
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="click-animation-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `hsl(var(--${p.color}))`,
            opacity: p.opacity,
            transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rotation}deg)`,
            transitionDuration: `${FADE_IN_DURATION + HOLD_DURATION + 500}ms`, // Covers both phases
            transitionDelay: `${p.delay}ms`,
            transitionProperty: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

export default ClickAnimationEffect;
