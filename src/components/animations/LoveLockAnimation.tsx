import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoveLockAnimationProps {
  onUnlock?: () => void;
  className?: string;
}

export const LoveLockAnimation: React.FC<LoveLockAnimationProps> = ({ 
  onUnlock,
  className = ""
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // 延迟触发回调，让动画播放完
    setTimeout(() => {
      if (onUnlock) onUnlock();
    }, 1500);
  };

  return (
    <div className={`relative flex items-center justify-center w-64 h-64 cursor-pointer select-none ${className}`}
         onClick={handleUnlock}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      
      {/* 锁体 (心形) */}
      <motion.div
        className="absolute z-10"
        animate={{
          scale: isUnlocked ? [1, 1.1, 1] : (isHovered ? 1.05 : 1),
        }}
        transition={{ duration: 0.3 }}
      >
        <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 红色爱心锁体 */}
          <path d="M60 105C60 105 15 75 15 42.5C15 25 29.5 15 42.5 15C52 15 57 20 60 25C63 20 68 15 77.5 15C90.5 15 105 25 105 42.5C105 75 60 105 60 105Z" fill="#E62E3B" stroke="#000" strokeWidth="4" strokeLinejoin="round"/>
          
          {/* 黑色阴影/立体感 */}
          <path d="M105 42.5C105 75 60 105 60 105C60 105 70 80 85 65C100 50 105 42.5 105 42.5Z" fill="#A41C25"/>
          
          {/* 钥匙孔 (心形) */}
          <path d="M60 70C60 70 48 60 48 50C48 44 52 40 56 40C58.5 40 60 42 60 42C60 42 61.5 40 64 40C68 40 72 44 72 50C72 60 60 70 60 70Z" fill="#0E3D78" stroke="#000" strokeWidth="2"/>
        </svg>
      </motion.div>

      {/* 锁环 (U型) */}
      <motion.div
        className="absolute z-0"
        style={{ top: '20px' }}
        animate={{
          y: isUnlocked ? -30 : 0,
          rotate: isUnlocked ? -15 : 0,
          transformOrigin: 'bottom left'
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15,
          delay: isUnlocked ? 0.6 : 0 
        }}
      >
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 80V40C10 23.4315 23.4315 10 40 10C56.5685 10 70 23.4315 70 40V80" stroke="#0E3D78" strokeWidth="12" strokeLinecap="round"/>
          {/* 锁环高光/颜色过渡 */}
          <path d="M15 80V40C15 26.1929 26.1929 15 40 15C53.8071 15 65 26.1929 65 40V80" stroke="#1D64B4" strokeWidth="2"/>
        </svg>
      </motion.div>

      {/* 钥匙插入动画 */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            className="absolute z-20"
            style={{ left: '-20px', top: '110px' }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: 50, 
              opacity: 1,
              rotate: [0, 0, 90, 90], // 插入后旋转
            }}
            transition={{ 
              duration: 1,
              times: [0, 0.4, 0.7, 1], // 控制关键帧时间
              ease: "easeInOut"
            }}
          >
            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15H20" stroke="#F5B203" strokeWidth="6" strokeLinecap="round"/>
              <path d="M40 15V22" stroke="#F5B203" strokeWidth="6" strokeLinecap="round"/>
              <path d="M48 15V22" stroke="#F5B203" strokeWidth="6" strokeLinecap="round"/>
              {/* 钥匙柄 (心形) */}
              <path d="M20 15C20 22 10 28 5 25C0 22 0 15 5 10C10 5 20 8 20 15Z" fill="none" stroke="#F5B203" strokeWidth="4"/>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 解锁时的礼花/光芒效果 */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            className="absolute right-0 top-0 z-30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
             <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               <line x1="5" y1="5" x2="15" y2="15" stroke="#F5B203" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
               <line x1="35" y1="5" x2="25" y2="15" stroke="#F5B203" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
               <line x1="35" y1="35" x2="25" y2="25" stroke="#F5B203" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4"/>
             </svg>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
