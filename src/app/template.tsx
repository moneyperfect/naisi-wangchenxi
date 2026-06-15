"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (sessionStorage.getItem("skip-next-route-loading") === "1") {
      sessionStorage.removeItem("skip-next-route-loading");
      return;
    }

    // 淡入 → 短暂显示 → 淡出
    setVisible(true);
    setTransitioning(true);

    const fadeOutTimer = setTimeout(() => {
      setTransitioning(false);
    }, 150);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 300);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) {
    return <div className="relative">{children}</div>;
  }

  return (
    <>
      <div className="relative">{children}</div>
      <div
        className="fixed inset-0 z-[60] pointer-events-none bg-cream transition-opacity duration-150"
        style={{ opacity: transitioning ? 1 : 0 }}
      />
    </>
  );
}
