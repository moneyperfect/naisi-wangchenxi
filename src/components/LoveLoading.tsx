"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

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
        "flex items-center justify-center",
        fullScreen ? "fixed inset-0 z-[60]" : "min-h-[60vh] w-full",
        className,
      ].join(" ")}
      style={{ backgroundColor: "#fffbf7" }}
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        {!videoFailed && allowsMotion ? (
          <video
            src={LOADING_VIDEO_SRC}
            className="size-24 object-contain sm:size-[120px]"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <div className="size-24 sm:size-[120px] flex items-center justify-center">
            <Heart
              size={48}
              className="text-warm-400 animate-pulse"
              fill="currentColor"
            />
          </div>
        )}

        <p className="font-serif text-base font-semibold text-stone-700 sm:text-lg">
          {message}
        </p>
      </div>
    </div>
  );
}
