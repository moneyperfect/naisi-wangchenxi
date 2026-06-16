"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_VIDEO_SRC = "/animations/intro.mp4";
const INTRO_FALLBACK_MS = 2400;

type PageTransitionProps = {
  children: ReactNode;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
};

type Stage = "locked" | "unlocking" | "unlocked";

export function LoveLockVideoTransition({
  children,
  autoPlay = false,
  onAnimationComplete,
}: PageTransitionProps) {
  const [allowsMotion, setAllowsMotion] = useState(false);
  const [motionPreferenceKnown, setMotionPreferenceKnown] = useState(false);
  const [stage, setStage] = useState<Stage>("locked");
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setStage("unlocked");
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  useEffect(() => {
    const canPlayMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAllowsMotion(canPlayMotion);
    setMotionPreferenceKnown(true);

    if (!canPlayMotion) {
      completeIntro();
    }
  }, [completeIntro]);

  useEffect(() => {
    if (stage !== "unlocking") return;

    const timer = window.setTimeout(completeIntro, INTRO_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [completeIntro, stage]);

  function handleStartUnlocking() {
    if (stage !== "locked") return;
    if (!motionPreferenceKnown) return;

    if (!allowsMotion) {
      completeIntro();
      return;
    }

    setStage("unlocking");
    const video = videoRef.current;

    if (!video) {
      completeIntro();
      return;
    }

    video.currentTime = 0;
    video.play().catch(() => completeIntro());
  }

  useEffect(() => {
    if (!autoPlay || stage !== "locked" || !motionPreferenceKnown) return;

    handleStartUnlocking();
  }, [autoPlay, motionPreferenceKnown, stage]);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "100dvh" }}>
      <AnimatePresence>
        {stage !== "unlocked" && (
          <motion.div
            className="absolute inset-0 z-[60] flex cursor-pointer items-center justify-center px-6 bg-cream"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={handleStartUnlocking}
          >
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 text-center">
              <video
                ref={videoRef}
                src={INTRO_VIDEO_SRC}
                className="w-56 object-contain sm:w-72 bg-cream rounded-2xl"
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onEnded={completeIntro}
                onError={completeIntro}
              />

              {stage === "locked" && !autoPlay && (
                <button
                  type="button"
                  disabled={!motionPreferenceKnown}
                  className="rounded-full bg-warm-500 px-6 py-3 font-serif text-sm font-semibold text-cream shadow-lg shadow-warm-500/20 transition hover:bg-warm-600 active:scale-95 disabled:cursor-wait disabled:opacity-70"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleStartUnlocking();
                  }}
                >
                  点击开启我们的故事
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full"
        initial={false}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
