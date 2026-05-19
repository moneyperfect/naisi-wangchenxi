"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}

export const LoveLockVideoTransition: React.FC<PageTransitionProps> = ({ 
  children,
  onAnimationComplete
}) => {
  const [stage, setStage] = useState<'locked' | 'unlocking' | 'unlocked'>('locked');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartUnlocking = () => {
    if (stage === 'locked') {
      setStage('unlocking');
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const handleVideoEnded = () => {
    setStage('unlocked');
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

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
            <div className="relative w-full max-w-md aspect-square flex flex-col items-center justify-center">
              {/* 这里使用原视频作为动画序列，但利用静音自动播放或者点击播放控制 */}
              <video 
                ref={videoRef}
                src="/assets/love-lock.mp4" 
                className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
                playsInline
                muted
                onEnded={handleVideoEnded}
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
