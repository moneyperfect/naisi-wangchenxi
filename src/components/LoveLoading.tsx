"use client";

import { useEffect, useState } from "react";

const LOADING_VIDEO_SRC = "/animations/loading.mp4";

type LoveLoadingProps = {
  fullScreen?: boolean;
  message?: string;
  className?: string;
};

function useAllowsMotion() {
  const [allowsMotion, setAllowsMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setAllowsMotion(!mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  return allowsMotion === true;
}

export function LoveLoading({
  fullScreen = false,
  message = "正在加载我们的故事...",
  className = "",
}: LoveLoadingProps) {
  const [skipLoading] = useState(() => {
    if (typeof window === "undefined") return false;

    const shouldSkip = sessionStorage.getItem("skip-next-app-loading") === "1";
    if (shouldSkip) {
      sessionStorage.removeItem("skip-next-app-loading");
    }

    return shouldSkip;
  });
  const allowsMotion = useAllowsMotion();
  const [videoFailed, setVideoFailed] = useState(false);

  if (skipLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={[
        "flex items-center justify-center bg-gradient-to-br from-cream via-warm-50 to-warm-100",
        fullScreen ? "fixed inset-0 z-[60] min-h-dvh" : "min-h-[60dvh] w-full",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        {!videoFailed && (
          <video
            key={allowsMotion ? "motion" : "still"}
            src={LOADING_VIDEO_SRC}
            className="size-24 object-contain mix-blend-multiply sm:size-[120px]"
            autoPlay={allowsMotion}
            loop={allowsMotion}
            muted
            playsInline
            preload={allowsMotion ? "auto" : "metadata"}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        )}

        <p className="font-serif text-base font-semibold text-stone-700 sm:text-lg">
          {message}
        </p>
      </div>
    </div>
  );
}
