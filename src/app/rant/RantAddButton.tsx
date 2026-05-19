"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { RantForm } from "@/components/rant/RantForm";

export function RantAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full text-stone-400 hover:text-warm-500 hover:bg-warm-100 transition-colors"
      >
        <Plus size={20} />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="发个吐槽">
        <RantForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
