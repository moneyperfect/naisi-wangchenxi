"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoveLoading } from "@/components/LoveLoading";

const INITIAL_LOADING_MS = 1200;

export function InitialLoadingOverlay() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const hasCheckedInitialRoute = useRef(false);

  useEffect(() => {
    if (hasCheckedInitialRoute.current) return;
    hasCheckedInitialRoute.current = true;

    if (pathname === "/gate") return;

    const shouldSkip =
      sessionStorage.getItem("skip-next-route-loading") === "1" ||
      sessionStorage.getItem("skip-next-app-loading") === "1";

    if (shouldSkip) {
      sessionStorage.removeItem("skip-next-route-loading");
      sessionStorage.removeItem("skip-next-app-loading");
      return;
    }

    setShow(true);
    const timer = window.setTimeout(() => setShow(false), INITIAL_LOADING_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <LoveLoading fullScreen />
    </div>
  );
}
