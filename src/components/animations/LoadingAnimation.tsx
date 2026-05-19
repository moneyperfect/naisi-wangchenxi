"use client";

import React from 'react';

interface LoadingAnimationProps {
  className?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  className = "" 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <video 
        src="/assets/loading-animation.mp4" 
        className="w-full h-full object-contain mix-blend-multiply"
        autoPlay
        playsInline
        loop
        muted
      />
    </div>
  );
};
