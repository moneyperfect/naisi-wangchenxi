"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { WishlistForm } from "@/components/wishlist/WishlistForm";

export function WishlistAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-full bg-warm-500 text-white flex items-center justify-center hover:bg-warm-600 transition-colors shadow-sm"
      >
        <Plus size={18} />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="许下新心愿">
        <WishlistForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}
