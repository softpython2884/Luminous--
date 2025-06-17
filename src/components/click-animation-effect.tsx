
"use client";

import React, { useState, useEffect } from 'react';
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
  rotation: number;
  destX: number; 
  destY: number;
  delay: number; 
}

const INITIAL_RENDER_DELAY_MS = 50; // ms before triggering first animation
const PARTICLE_FADE_IN_STAGE_MS = 500; // Target duration for particle fade-in
const PARTICLE_HOLD_STAGE_MS = 800;   // Target duration for particles to hold shape
const PARTICLE_TRANSITION_MS = 1000; // How long individual particle transitions take (fade-in, then disperse/fade-out)
const STAGGER_MAX_DELAY_MS = 200; // Max random delay for staggering particle animations

// Calculate total effect lifespan for onComplete callback
const EFFECT_LIFESPAN = INITIAL_RENDER_DELAY_MS + PARTICLE_FADE_IN_STAGE_MS + PARTICLE_HOLD_STAGE_MS + PARTICLE_TRANSITION_MS + STAGGER_MAX_DELAY_MS + 200; // Added buffer

const ClickAnimationEffect: React.FC<ClickAnimationEffectProps> = ({ id, x, y, shapeType, onComplete }) => {
  const [particles, setParticles] = useState<ParticleState[]>([]);
  const [overallRotation, setOverallRotation] = useState(0);

  useEffect(() => {
    const shapePoints = getShapePoints(shapeType);
    const newParticles: ParticleState[] = shapePoints.map((p, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const dispersionRadius = 120 + Math.random() * 80; // Increased dispersion
      return {
        id: `particle-${id}-${i}`,
        x: p.x, 
        y: p.y,
        size: Math.random() * 4 + 4,
        color: Math.random() > 0.3 ? 'primary' : 'accent',
        opacity: 0,
        scale: 0,
        rotation: Math.random() * 360,
        destX: p.x + dispersionRadius * Math.cos(angle), 
        destY: p.y + dispersionRadius * Math.sin(angle),
        delay: Math.random() * STAGGER_MAX_DELAY_MS, 
      };
    });
    setParticles(newParticles);

    // Animate in
    const fadeInTimer = setTimeout(() => {
      setParticles(prev => prev.map(p => ({ ...p, opacity: 1, scale: 1 })));
      setOverallRotation(Math.random() * 60 - 30); 
    }, INITIAL_RENDER_DELAY_MS); 

    // Animate out (disperse)
    const fadeOutTimer = setTimeout(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.destX, 
        y: p.destY,
        opacity: 0,
        scale: 0.3 + Math.random() * 0.4, 
      })));
      setOverallRotation(prev => prev + Math.random() * 90 - 45); // More rotation on disperse
    }, INITIAL_RENDER_DELAY_MS + PARTICLE_FADE_IN_STAGE_MS + PARTICLE_HOLD_STAGE_MS);
    
    const completeTimer = setTimeout(() => {
      onComplete(id);
    }, EFFECT_LIFESPAN);

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
        transition: `transform ${PARTICLE_TRANSITION_MS * 1.5}ms ease-out`, // Overall shape rotation transition
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
            transitionDuration: `${PARTICLE_TRANSITION_MS}ms`,
            transitionDelay: `${p.delay}ms`,
            transitionProperty: 'transform, opacity, box-shadow', // Ensure box-shadow is transitioned
          }}
        />
      ))}
    </div>
  );
};

export default ClickAnimationEffect;
