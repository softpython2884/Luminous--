
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CustomCursor from '@/components/custom-cursor';
import ClickAnimationEffect from '@/components/click-animation-effect';
import BackgroundParticles from '@/components/background-particles'; // Import new component
import { SHAPES, ShapeType } from '@/lib/shapes';

interface ClickAnimation {
  id: string;
  x: number;
  y: number;
  shapeType: ShapeType;
}

export default function Home() {
  const [cursorPosition, setCursorPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([]);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    if (typeof window !== "undefined") {
        window.addEventListener('mousemove', handleMouseMove);
        document.body.style.cursor = 'none'; 
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('mousemove', handleMouseMove);
        document.body.style.cursor = 'auto'; 
      }
    };
  }, []);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isClient) return; // Ensure click logic only runs client-side after mount
    const newAnimation: ClickAnimation = {
      id: `anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: event.clientX,
      y: event.clientY,
      shapeType: SHAPES[currentShapeIndex],
    };
    setClickAnimations(prev => [...prev, newAnimation]);
    setCurrentShapeIndex(prevIndex => (prevIndex + 1) % SHAPES.length);
  }, [currentShapeIndex, isClient]);

  const handleAnimationComplete = useCallback((id: string) => {
    setClickAnimations(prev => prev.filter(anim => anim.id !== id));
  }, []);

  return (
    <main 
      className="relative w-screen h-screen bg-background overflow-hidden flex items-center justify-center"
      onClick={handleCanvasClick}
      role="application" 
      aria-label="Luminous Clicks Interactive Area"
    >
      {isClient && <BackgroundParticles />} {/* Render background particles */}
      {isClient && <CustomCursor cursorPosition={cursorPosition} />}
      {clickAnimations.map(anim => (
        <ClickAnimationEffect
          key={anim.id}
          id={anim.id}
          x={anim.x}
          y={anim.y}
          shapeType={anim.shapeType}
          onComplete={handleAnimationComplete}
        />
      ))}
       {/* Optional: Display current shape name for debugging or as a feature */}
       {/* <div className="absolute bottom-4 left-4 text-xs text-muted-foreground p-2 bg-card rounded">
         Next Shape: {SHAPES[(currentShapeIndex) % SHAPES.length]}
       </div> */}
    </main>
  );
}
