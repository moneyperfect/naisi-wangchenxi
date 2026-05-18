"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AnniversaryForm } from "@/components/anniversary/AnniversaryForm";

export function AnniversaryAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full text-warm-500 hover:bg-warm-100 transition-colors"
      >
        <Plus size={20} />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="添加纪念日">
        <AnniversaryForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
