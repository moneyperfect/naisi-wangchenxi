"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────
   Pure SVG + Framer-Motion Love-Lock
   完全用代码实现，无需视频文件
   任何分辨率下都清晰锐利
   ───────────────────────────────────── */

interface PageTransitionProps {
  children: React.ReactNode;
  onAnimationComplete?: () => void;
}

/* ── 锁体心形路径 ── */
const HEART_BODY =
  "M60 100C60 100 12 72 12 38C12 20 28 8 42 8C53 8 57 14 60 20C63 14 67 8 78 8C92 8 108 20 108 38C108 72 60 100 60 100Z";
/* 心形锁体暗面 (右下方 3D 感) */
const HEART_SHADOW =
  "M108 38C108 72 60 100 60 100C60 100 72 78 88 62C100 50 108 38 108 38Z";
/* 底部黑色阴影 */
const HEART_BOTTOM =
  "M60 100C60 100 20 80 14 50C12 40 16 35 20 36C36 40 50 70 60 100Z M60 100C60 100 100 80 106 50C108 40 104 35 100 36C84 40 70 70 60 100Z";
/* 心形钥匙孔 */
const KEYHOLE =
  "M60 62C60 62 50 54 50 46C50 41 53.5 38 56.5 38C58.5 38 60 40 60 40C60 40 61.5 38 63.5 38C66.5 38 70 41 70 46C70 54 60 62 60 62Z";

/* ── 钥匙形状 ── */
const KEY_BLADE = "M0 12H30";
const KEY_TEETH_1 = "M20 12V18";
const KEY_TEETH_2 = "M26 12V16";
/* 钥匙柄 (心形环) */
const KEY_HANDLE =
  "M-4 12C-4 5 -12 0 -16 3C-20 6 -20 12 -16 18C-12 22 -4 19 -4 12Z";

export const LoveLockVideoTransition: React.FC<PageTransitionProps> = ({
  children,
  onAnimationComplete,
}) => {
  const [stage, setStage] = useState<"locked" | "unlocking" | "unlocked">(
    "locked"
  );

  const handleClick = useCallback(() => {
    if (stage === "locked") setStage("unlocking");
  }, [stage]);

  const handleAnimEnd = useCallback(() => {
    setStage("unlocked");
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  /* ── 锁环动画的参数（手动对齐视频关键帧） ── */
  const shackleVariants = {
    locked: {
      y: 0,
      rotate: 0,
      originX: "30%",
      originY: "100%",
    },
    open: {
      y: -14,
      rotate: -30,
      originX: "30%",
      originY: "100%",
    },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* ── 动画遮罩层 ── */}
      <AnimatePresence>
        {stage !== "unlocked" && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-white cursor-pointer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            onClick={handleClick}
          >
            <div className="relative flex flex-col items-center">
              {/* ─── SVG 主体 ─── */}
              <svg
                width="180"
                height="180"
                viewBox="-10 -30 140 145"
                fill="none"
                className="overflow-visible"
              >
                {/* ── 锁环 (U 形) ── */}
                <motion.g
                  variants={shackleVariants}
                  initial="locked"
                  animate={stage === "unlocking" ? "open" : "locked"}
                  transition={{
                    delay: stage === "unlocking" ? 1.4 : 0,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 180,
                    damping: 14,
                  }}
                >
                  {/* 锁环外部 */}
                  <path
                    d="M38 12 V-4 C38 -18 46 -26 60 -26 C74 -26 82 -18 82 -4 V12"
                    stroke="#1B3F6B"
                    strokeWidth="11"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* 锁环高光 */}
                  <path
                    d="M42 12 V-2 C42 -14 48.5 -22 60 -22 C71.5 -22 78 -14 78 -2 V12"
                    stroke="#2563A8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.g>

                {/* ── 锁体底部阴影 ── */}
                <path d={HEART_BOTTOM} fill="#222" opacity="0.25" />

                {/* ── 锁体心形 ── */}
                <path d={HEART_BODY} fill="#EF4456" />

                {/* ── 锁体 3D 暗面 ── */}
                <path d={HEART_SHADOW} fill="#C22A3A" opacity="0.6" />

                {/* ── 锁体高光 (左上方) ── */}
                <ellipse
                  cx="42"
                  cy="36"
                  rx="8"
                  ry="12"
                  fill="#FF8090"
                  opacity="0.45"
                />

                {/* ── 锁体腮红 (右侧两个小点) ── */}
                <ellipse
                  cx="76"
                  cy="48"
                  rx="3.5"
                  ry="2.5"
                  fill="#C22A3A"
                  opacity="0.35"
                />
                <ellipse
                  cx="84"
                  cy="52"
                  rx="2.8"
                  ry="2"
                  fill="#C22A3A"
                  opacity="0.25"
                />

                {/* ── 钥匙孔 ── */}
                <path d={KEYHOLE} fill="#0E3058" />

                {/* ── 钥匙 (动画) ── */}
                {stage === "unlocking" && (
                  <motion.g
                    initial={{ x: -50, opacity: 0 }}
                    animate={{
                      x: [null, 24, 24, 24, -50],
                      opacity: [0, 1, 1, 1, 0],
                      rotate: [0, 0, -20, -20, -20],
                    }}
                    transition={{
                      duration: 3.2,
                      times: [0, 0.25, 0.4, 0.65, 0.82],
                      ease: "easeInOut",
                      onComplete: handleAnimEnd,
                    }}
                    style={{ originX: "30px", originY: "12px" }}
                  >
                    <g transform="translate(22, 38)">
                      {/* 钥匙杆 */}
                      <path
                        d={KEY_BLADE}
                        stroke="#F5B800"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* 钥匙齿 */}
                      <path
                        d={KEY_TEETH_1}
                        stroke="#F5B800"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d={KEY_TEETH_2}
                        stroke="#F5B800"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* 钥匙柄 */}
                      <path
                        d={KEY_HANDLE}
                        stroke="#F5B800"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </g>
                  </motion.g>
                )}

                {/* ── 闪光效果 ── */}
                {stage === "unlocking" && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0, 1, 1, 0],
                      scale: [0.3, 0.3, 1, 1.1, 0.8],
                    }}
                    transition={{
                      duration: 3.2,
                      times: [0, 0.4, 0.5, 0.6, 0.75],
                      ease: "easeOut",
                    }}
                  >
                    {/* 右上闪光线 */}
                    <line
                      x1="92"
                      y1="-10"
                      x2="102"
                      y2="-20"
                      stroke="#F5B800"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="100"
                      y1="-2"
                      x2="112"
                      y2="-6"
                      stroke="#F5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="96"
                      y1="4"
                      x2="108"
                      y2="6"
                      stroke="#F5B800"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </motion.g>
                )}
              </svg>

              {/* ── 提示文字 ── */}
              {stage === "locked" && (
                <motion.p
                  className="mt-6 text-sm tracking-[0.2em] text-gray-400 font-medium select-none"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                >
                  点击解锁我们的故事
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 实际页面内容 ── */}
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{
          opacity: stage === "unlocked" ? 1 : 0,
          filter: stage === "unlocked" ? "blur(0px)" : "blur(10px)",
        }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
