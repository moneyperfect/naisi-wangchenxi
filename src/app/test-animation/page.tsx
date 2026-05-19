"use client";

import { LoveLockVideoTransition } from '@/components/animations/LoveLockVideoTransition';
import { LoadingAnimation } from '@/components/animations/LoadingAnimation';
import { useState } from 'react';

export default function TestAnimationPage() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  return (
    <LoveLockVideoTransition onAnimationComplete={() => setAnimationCompleted(true)}>
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">欢迎来到我们的世界</h1>
        <p className="text-gray-600 mb-8">
          {animationCompleted ? '动画已完成！' : '等待解锁中...'}
        </p>
        
        {/* Loading animation test section */}
        {animationCompleted && (
          <div className="flex flex-col items-center mt-10 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-medium text-gray-700 mb-4">加载状态演示</h2>
            <div className="w-32 h-32">
              <LoadingAnimation />
            </div>
            <p className="text-sm text-gray-500 mt-4">正在努力加载中...</p>
          </div>
        )}
      </div>
    </LoveLockVideoTransition>
  );
}
