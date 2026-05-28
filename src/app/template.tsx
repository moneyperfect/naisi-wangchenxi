"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (sessionStorage.getItem("skip-next-route-loading") === "1") {
      sessionStorage.removeItem("skip-next-route-loading");
      return;
    }

    setTransitioning(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransitioning(false));
    });
  }, [pathname]);

  return (
    <>
      <div className="relative">{children}</div>

      {transitioning && (
        <div className="fixed inset-0 z-[60] pointer-events-none bg-cream" />
      )}
    </>
  );
}
