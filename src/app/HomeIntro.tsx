"use client";

import { useState, useEffect } from "react";
import { LoveLockVideoTransition } from "@/components/animations/LoveLockVideoTransition";

function consumeCookie(name: string) {
  const hasCookie = document.cookie
    .split(";")
    .some((item) => item.trim().startsWith(`${name}=`));

  if (hasCookie) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  }

  return hasCookie;
}

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [skip, setSkip] = useState(false);
  const [autoPlayIntro, setAutoPlayIntro] = useState(false);

  useEffect(() => {
    const shouldAutoPlay =
      sessionStorage.getItem("intro-autoplay") === "1" ||
      consumeCookie("intro-autoplay");

    if (shouldAutoPlay) {
      sessionStorage.removeItem("intro-autoplay");
      sessionStorage.removeItem("skip-next-app-loading");
      sessionStorage.removeItem("skip-next-route-loading");
      consumeCookie("skip-next-app-loading");
      consumeCookie("skip-next-route-loading");
      setAutoPlayIntro(true);
      setSkip(false);
      return;
    }

    const seen = sessionStorage.getItem("intro-seen");
    if (seen) setSkip(true);
  }, []);

  if (skip) return <>{children}</>;

  return (
    <LoveLockVideoTransition
      autoPlay={autoPlayIntro}
      onAnimationComplete={() => {
        sessionStorage.setItem("intro-seen", "1");
      }}
    >
      {children}
    </LoveLockVideoTransition>
  );
}
