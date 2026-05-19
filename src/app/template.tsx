"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LoveLoading } from "@/components/LoveLoading";

const MIN_ROUTE_LOADING_MS = 1200;

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
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="relative"
          initial="enter"
          animate="visible"
          exit="exit"
        >
          {/* warm overlay that sweeps in/out */}
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,107,74,0.12) 0%, rgba(255,247,245,0.6) 100%)",
            }}
            variants={{
              enter: { opacity: 1 },
              visible: { opacity: 0 },
              exit: { opacity: 1 },
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />

          {/* page content */}
          <motion.div
            variants={{
              enter: { opacity: 0, scale: 0.99 },
              visible: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 1.005 },
            }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showRouteLoading && (
          <motion.div
            key="minimum-route-loading"
            className="fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <LoveLoading fullScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
