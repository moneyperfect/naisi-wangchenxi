"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_VIDEO_SRC = "/animations/intro.mp4";

type PageTransitionProps = {
  children: ReactNode;
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
};

type Stage = "locked" | "unlocking" | "unlocked";

function useAllowsMotion() {
  const [allowsMotion, setAllowsMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      setAllowsMotion(false);
      return;
    }

    const syncPreference = () => setAllowsMotion(!mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  return allowsMotion;
}

export function LoveLockVideoTransition({
  children,
  autoPlay = false,
  onAnimationComplete,
}: PageTransitionProps) {
  const [stage, setStage] = useState<Stage>("locked");
  const videoRef = useRef<HTMLVideoElement>(null);
  const allowsMotion = useAllowsMotion();
  const motionPreferenceKnown = true;

  function completeIntro() {
    setStage("unlocked");
    onAnimationComplete?.();
  }

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
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#fffbf7" }}>
      <AnimatePresence>
        {stage !== "unlocked" && (
          <motion.div
            className="absolute inset-0 z-[60] flex cursor-pointer items-center justify-center px-6"
            style={{ backgroundColor: "#fffbf7" }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={handleStartUnlocking}
          >
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 text-center">
              <video
                ref={videoRef}
                src={INTRO_VIDEO_SRC}
                className="w-56 object-contain sm:w-72"
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
