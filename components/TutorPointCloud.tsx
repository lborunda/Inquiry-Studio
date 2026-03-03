import React, { useState, useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const TutorPointCloud = () => {
  const [points, setPoints] = useState<Point3D[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const cloudContainerRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const rotationRef = useRef({ x: -15, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const zPositionRef = useRef(-200);


  useEffect(() => {
    const loadPoints = async () => {
      try {
        const response = await fetch('/CowgillPointCloud.csv');
        if (!response.ok) {
          throw new Error(`Failed to load point cloud data. Status: ${response.status}`);
        }
        const csvText = await response.text();
        const parsedPoints = csvText
          .trim()
          .split('\n')
          .slice(1) // Skip header row
          .map(row => {
            const [x, y, z] = row.split(',').map(Number);
            return { x, y, z };
          })
          .filter(p => !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z));

        if (parsedPoints.length === 0) {
          console.warn("No valid points were loaded from the CSV file.");
          return;
        }

        const boundingBox = parsedPoints.reduce((acc, p) => ({
            min: {
                x: Math.min(acc.min.x, p.x),
                y: Math.min(acc.min.y, p.y),
                z: Math.min(acc.min.z, p.z),
            },
            max: {
                x: Math.max(acc.max.x, p.x),
                y: Math.max(acc.max.y, p.y),
                z: Math.max(acc.max.z, p.z),
            },
        }), { 
            min: { x: Infinity, y: Infinity, z: Infinity },
            max: { x: -Infinity, y: -Infinity, z: -Infinity }
        });

        const center = {
          x: (boundingBox.min.x + boundingBox.max.x) / 2,
          y: (boundingBox.min.y + boundingBox.max.y) / 2,
          z: (boundingBox.min.z + boundingBox.max.z) / 2,
        };
        const size = {
          x: boundingBox.max.x - boundingBox.min.x,
          y: boundingBox.max.y - boundingBox.min.y,
          z: boundingBox.max.z - boundingBox.min.z,
        };

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim === 0 ? 1 : 600 / (maxDim / 2);

        const normalizedPoints = parsedPoints.map(p => ({
          x: (p.x - center.x) * scale,
          y: (p.y - center.y) * scale,
          z: (p.z - center.z) * scale,
        }));

        setPoints(normalizedPoints);

      } catch (error) {
        console.error("Could not load or parse tutor point cloud:", error);
      }
    };

    loadPoints();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    velocityRef.current = { x: 0, y: 0 };
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    const rotationSpeed = 0.25;
    const newRotationX = rotationRef.current.x - dy * rotationSpeed;
    const newRotationY = rotationRef.current.y + dx * rotationSpeed;
    
    velocityRef.current = {
      x: newRotationX - rotationRef.current.x,
      y: newRotationY - rotationRef.current.y
    };

    rotationRef.current = { x: newRotationX, y: newRotationY };
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZ = zPositionRef.current + e.deltaY * 0.2;
    // Clamp zoom level
    zPositionRef.current = Math.max(-400, Math.min(300, newZ));
  };


  useEffect(() => {
    const cloudElement = cloudContainerRef.current;
    if (!cloudElement || points.length === 0) return;

    const animate = () => {
      if (!isDraggingRef.current) {
        // Apply inertia (and slow it down with friction)
        if (Math.abs(velocityRef.current.x) > 0.01 || Math.abs(velocityRef.current.y) > 0.01) {
            rotationRef.current.x += velocityRef.current.x;
            rotationRef.current.y += velocityRef.current.y;
            velocityRef.current.x *= 0.95; // Friction
            velocityRef.current.y *= 0.95; // Friction
        } else {
            // If inertia has worn off, apply soft auto-rotation
            rotationRef.current.y += 0.03;
        }
      }
      
      cloudElement.style.transform = `translateZ(${zPositionRef.current}px) rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg)`;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [points]); // Rerun effect if points change

  return (
    <div 
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" 
        style={{ perspective: '1200px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
    >
      <div
        ref={cloudContainerRef}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {points.map((point, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-gray-400 rounded-full"
            style={{
              transform: `translate3d(${point.x}px, ${point.y}px, ${point.z}px)`,
              opacity: Math.max(0.3, (point.z + 120) / 240)
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorPointCloud;