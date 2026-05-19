"use client";

import { LoveLockVideoTransition } from '@/components/animations/LoveLockVideoTransition';
import { useState } from 'react';

export default function TestAnimationPage() {
  const [animationCompleted, setAnimationCompleted] = useState(false);

  return (
    <LoveLockVideoTransition onAnimationComplete={() => setAnimationCompleted(true)}>
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-pink-500 mb-4">欢迎来到我们的世界</h1>
        <p className="text-gray-600">
          {animationCompleted ? '动画已完成！' : '等待解锁中...'}
        </p>
      </div>
    </LoveLockVideoTransition>
  );
}
