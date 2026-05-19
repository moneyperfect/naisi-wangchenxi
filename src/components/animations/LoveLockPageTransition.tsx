"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}

export const LoveLockPageTransition: React.FC<PageTransitionProps> = ({ 
  children,
  onAnimationComplete
}) => {
  const [stage, setStage] = useState<'locked' | 'unlocking' | 'unlocked'>('locked');
  const [currentFrame, setCurrentFrame] = useState(0);
  const totalFrames = 101; 
  const fps = 25; 
  const frameInterval = 1000 / fps;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (stage === 'unlocking') {
      interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= totalFrames - 1) {
            clearInterval(interval);
            setStage('unlocked');
            if (onAnimationComplete) {
              onAnimationComplete();
            }
            return totalFrames - 1;
          }
          return prev + 1;
        });
      }, frameInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage, onAnimationComplete]);

  const handleStartUnlocking = () => {
    if (stage === 'locked') {
      setStage('unlocking');
    }
  };

  // Preload frames to avoid flicker
  useEffect(() => {
    for (let i = 0; i < totalFrames; i += 5) {
      const img = new Image();
      img.src = `/animations/frame_${i.toString().padStart(3, '0')}.webp`;
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* 动画遮罩层 */}
      <AnimatePresence>
        {stage !== 'unlocked' && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-white cursor-pointer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={handleStartUnlocking}
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* 这里使用提取出的帧作为动画序列 */}
              <img 
                src={`/animations/frame_${currentFrame.toString().padStart(3, '0')}.webp`} 
                alt="Love Lock Animation" 
                className="w-full h-full object-contain"
              />
              
              {stage === 'locked' && (
                <motion.div 
                  className="absolute bottom-10 left-0 right-0 text-center text-gray-500 font-medium tracking-widest text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  点击解锁我们的故事
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 实际页面内容 */}
      <motion.div 
        className="w-full h-full"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ 
          opacity: stage === 'unlocked' ? 1 : 0,
          filter: stage === 'unlocked' ? 'blur(0px)' : 'blur(10px)'
        }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
