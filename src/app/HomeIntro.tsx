"use client";

import { useState, useEffect } from "react";
import { LoveLockVideoTransition } from "@/components/animations/LoveLockVideoTransition";

export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("intro-seen");
    if (seen) setSkip(true);
  }, []);

  if (skip) return <>{children}</>;

  return (
    <LoveLockVideoTransition
      onAnimationComplete={() => {
        sessionStorage.setItem("intro-seen", "1");
      }}
    >
      {children}
    </LoveLockVideoTransition>
  );
}
