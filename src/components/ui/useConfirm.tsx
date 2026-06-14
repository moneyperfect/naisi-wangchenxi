"use client";

import { useState, useCallback } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    onConfirm: () => void;
  } | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          options,
          onConfirm: () => resolve(true),
        });
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setConfirmState(null);
  }, []);

  return { confirm, confirmState, handleClose };
}
