"use client";

import React from "react";

/* ─────────────────────────────────────────────
   Geometric Heart Loading Animation
   用纯 SVG + CSS 实现视频中的几何线框心形 +
   围绕心形旋转的弧线描边效果。
   任何分辨率都清晰，零网络请求。
   ───────────────────────────────────────────── */

interface LoadingAnimationProps {
  /** 容器额外 className */
  className?: string;
  /** 尺寸，默认 64px */
  size?: number;
  /** 提示文字 */
  text?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  className = "",
  size = 64,
  text,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-3 select-none ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        className="overflow-visible"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.06))" }}
      >
        {/* ── 几何线框心形 (low-poly 风格) ── */}
        <g opacity="0.85">
          {/* 左上小五边形 */}
          <polygon
            points="32,22 26,30 28,40 38,38 38,28"
            stroke="#DFAC7E"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 左大六边形 */}
          <polygon
            points="26,30 18,44 22,62 40,68 48,52 38,38"
            stroke="#D98E63"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 中间三角形 */}
          <polygon
            points="38,28 38,38 48,52"
            stroke="#D97B5A"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 右上五边形 */}
          <polygon
            points="38,28 48,22 58,26 62,38 48,40"
            stroke="#C8625A"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 中右三角形 */}
          <polygon
            points="48,40 62,38 58,52"
            stroke="#B54E4E"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 右下五边形 */}
          <polygon
            points="62,38 76,36 74,52 58,52"
            stroke="#8C3040"
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 中间链接线 */}
          <line
            x1="48"
            y1="40"
            x2="48"
            y2="52"
            stroke="#C06050"
            strokeWidth="1.0"
          />
          {/* 下方底部三角 */}
          <polygon
            points="40,68 48,52 58,52"
            stroke="#C06855"
            strokeWidth="1.0"
            fill="none"
            strokeLinejoin="round"
          />
          {/* 底部连线到心尖 */}
          <line
            x1="40"
            y1="68"
            x2="42"
            y2="78"
            stroke="#D08060"
            strokeWidth="1.0"
          />
        </g>

        {/* ── 旋转弧线 (围绕心形描边，模拟视频中的效果) ── */}
        {/* 弧线沿一个椭圆路径环绕心形旋转 */}
        <g className="loading-orbit">
          <ellipse
            cx="48"
            cy="48"
            rx="36"
            ry="32"
            stroke="url(#arc-gradient)"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="45 180"
            className="loading-arc"
          />
        </g>

        {/* 渐变定义 */}
        <defs>
          <linearGradient
            id="arc-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8C2030" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C84040" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8C2030" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {text && (
        <span className="text-xs text-gray-400 tracking-wider animate-pulse">
          {text}
        </span>
      )}

      {/* CSS 动画 */}
      <style jsx>{`
        .loading-orbit {
          animation: orbit-spin 1.3s linear infinite;
          transform-origin: 48px 48px;
        }

        @keyframes orbit-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .loading-arc {
          animation: dash-flow 1.3s ease-in-out infinite;
        }

        @keyframes dash-flow {
          0% {
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dashoffset: -40;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
