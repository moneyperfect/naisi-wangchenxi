"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-warm-50 rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl border border-warm-200/50 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="font-serif text-lg font-semibold text-stone-800">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-warm-100 transition-colors ml-auto"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
