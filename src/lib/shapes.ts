
export type Point = { x: number; y: number };

const NUM_PARTICLES_DEFAULT = 30;

export const getCirclePoints = (numParticles: number = NUM_PARTICLES_DEFAULT, radius: number = 50): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i < numParticles; i++) {
    const angle = (i / numParticles) * 2 * Math.PI;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }
  return points;
};

export const getHeartPoints = (numParticles: number = NUM_PARTICLES_DEFAULT + 10, scaleFactor: number = 4): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i < numParticles; i++) {
    const t = (i / numParticles) * 2 * Math.PI;
    const x = scaleFactor * 16 * Math.pow(Math.sin(t), 3);
    const y = -scaleFactor * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x, y });
  }
  return points;
};

export const getStarPoints = (numParticles: number = NUM_PARTICLES_DEFAULT + 20, outerRadius: number = 60, innerRadius: number = 25): Point[] => {
  const points: Point[] = [];
  const numTips = 5;
  const particlesPerSegment = Math.floor(numParticles / (numTips * 2));

  let lastPoint: Point | null = null;

  for (let i = 0; i < numTips; i++) {
    // Outer point
    let angle = (i / numTips) * 2 * Math.PI - Math.PI / 2;
    const pOuter: Point = {
      x: outerRadius * Math.cos(angle),
      y: outerRadius * Math.sin(angle),
    };
    if (lastPoint) {
      for (let j = 0; j < particlesPerSegment; j++) {
        const t = j / particlesPerSegment;
        points.push({
          x: lastPoint.x + (pOuter.x - lastPoint.x) * t,
          y: lastPoint.y + (pOuter.y - lastPoint.y) * t,
        });
      }
    }
    points.push(pOuter);
    lastPoint = pOuter;

    // Inner point
    angle += (1 / numTips) * Math.PI;
    const pInner: Point = {
      x: innerRadius * Math.cos(angle),
      y: innerRadius * Math.sin(angle),
    };
     if (lastPoint) {
      for (let j = 0; j < particlesPerSegment; j++) {
        const t = j / particlesPerSegment;
        points.push({
          x: lastPoint.x + (pInner.x - lastPoint.x) * t,
          y: lastPoint.y + (pInner.y - lastPoint.y) * t,
        });
      }
    }
    points.push(pInner);
    lastPoint = pInner;
  }
  
  // Connect last inner point to first outer point
  const firstOuterPoint = {
    x: outerRadius * Math.cos(-Math.PI / 2),
    y: outerRadius * Math.sin(-Math.PI / 2),
  };
  if (lastPoint) {
    for (let j = 0; j < particlesPerSegment; j++) {
      const t = j / particlesPerSegment;
      points.push({
        x: lastPoint.x + (firstOuterPoint.x - lastPoint.x) * t,
        y: lastPoint.y + (firstOuterPoint.y - lastPoint.y) * t,
      });
    }
  }

  return points;
};

export const SHAPES = ['circle', 'heart', 'star'] as const;
export type ShapeType = typeof SHAPES[number];

export const getShapePoints = (shape: ShapeType): Point[] => {
  switch (shape) {
    case 'circle':
      return getCirclePoints();
    case 'heart':
      return getHeartPoints();
    case 'star':
      return getStarPoints();
    default:
      return getCirclePoints();
  }
};
