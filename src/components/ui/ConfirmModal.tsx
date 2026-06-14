"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "确认操作",
  message,
  confirmText = "确定",
  cancelText = "取消",
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {variant === "danger" && (
            <div className="shrink-0 mt-0.5">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
          )}
          <p className="text-sm text-stone-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${
              variant === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
