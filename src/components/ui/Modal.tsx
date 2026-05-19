"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden p-4">
          <motion.div
            className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="relative z-10 flex min-h-full items-center justify-center py-2">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-warm-200/50 bg-warm-50 p-4 shadow-xl sm:p-6"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="mb-4 flex shrink-0 items-center justify-between">
                {title && (
                  <h2 className="min-w-0 truncate font-serif text-lg font-semibold text-stone-800">
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto rounded-full p-1.5 text-stone-400 transition-colors hover:bg-warm-100 hover:text-stone-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto overflow-x-hidden pr-1">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
