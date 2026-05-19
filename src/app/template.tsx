"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
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
            enter: { opacity: 0, scale: 0.985, filter: "blur(6px)" },
            visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
            exit: { opacity: 0, scale: 1.01, filter: "blur(4px)" },
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
