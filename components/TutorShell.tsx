
import React from 'react';

interface TutorShellProps {
  progress: number; // 0 to 100
  isThinking: boolean;
}

const TutorShell = ({ progress, isThinking }: TutorShellProps) => {
  const shellLayers = 6;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const visibleLayers = Math.ceil((clampedProgress / 100) * shellLayers);

  return (
    <div className={`relative w-16 h-16 transition-transform duration-500 ${isThinking ? 'animate-pulse' : ''}`}>
      {[...Array(shellLayers)].map((_, i) => (
        <svg
          key={i}
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{
            transform: `rotate(${i * 60}deg)`,
            opacity: i < visibleLayers ? 1 : 0.1,
            transition: 'opacity 0.7s ease-in-out',
          }}
        >
          <path
            d="M50 0 A50 50 0 0 1 93.3 25"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
};

export default TutorShell;
