"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LoveLoading } from "@/components/LoveLoading";

const MIN_ROUTE_LOADING_MS = 800;

let hasRenderedInitialRoute = false;

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showRouteLoading, setShowRouteLoading] = useState(false);

  useEffect(() => {
    if (!hasRenderedInitialRoute) {
      hasRenderedInitialRoute = true;
      return;
    }

    if (sessionStorage.getItem("skip-next-route-loading") === "1") {
      sessionStorage.removeItem("skip-next-route-loading");
      setShowRouteLoading(false);
      return;
    }

    setShowRouteLoading(true);
    const timer = window.setTimeout(() => {
      setShowRouteLoading(false);
    }, MIN_ROUTE_LOADING_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <div className="relative">{children}</div>

      {showRouteLoading && (
        <div className="fixed inset-0 z-[60] pointer-events-none" style={{ backgroundColor: "#fffbf7" }}>
          <LoveLoading fullScreen />
        </div>
      )}
    </>
  );
}
