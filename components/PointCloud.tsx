import React, { useState, useEffect, useRef, memo } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const PointCloud = memo(() => { // Using React.memo to prevent re-renders from parent
  const [points, setPoints] = useState<Point3D[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const cloudContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const generatePoints = () => {
      const newPoints: Point3D[] = [];
      const numPoints = 250;
      const radius = 300; // Radius of the sphere
      for (let i = 0; i < numPoints; i++) {
        const phi = Math.acos(-1 + (2 * i) / numPoints);
        const theta = Math.sqrt(numPoints * Math.PI) * phi;
        newPoints.push({
          x: radius * Math.cos(theta) * Math.sin(phi),
          y: radius * Math.sin(theta) * Math.sin(phi),
          z: radius * Math.cos(phi),
        });
      }
      setPoints(newPoints);
    };

    generatePoints();
  }, []);
  
  useEffect(() => {
    const cloudElement = cloudContainerRef.current;
    if (!cloudElement) return;

    const animate = (time: number) => {
      // Time-based continuous rotation for smoothness and consistency
      const rotationY = time * 0.01;
      const rotationX = time * 0.005;

      cloudElement.style.transform = `translateZ(200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup function to cancel the animation frame on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center" style={{ perspective: '800px' }}>
      <div
        ref={cloudContainerRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {points.map((point, i) => {
            const radius = 300;
            const perspectiveScale = 400 / (400 - point.z);
            return (
                <div
                    key={i}
                    className="absolute rounded-full bg-gray-400"
                    style={{
                        transform: `translate3d(${point.x}px, ${point.y}px, ${point.z}px)`,
                        width: `${Math.max(0.5, perspectiveScale * 1.5)}px`,
                        height: `${Math.max(0.5, perspectiveScale * 1.5)}px`,
                        opacity: Math.max(0.1, (point.z + radius) / (2 * radius)),
                    }}
                />
            )
        })}
      </div>
    </div>
  );
});

export default PointCloud;