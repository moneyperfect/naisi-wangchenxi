"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { PhotoUpload } from "@/components/album/PhotoUpload";

export function AlbumUploadButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full text-warm-500 hover:bg-warm-100 transition-colors"
      >
        <Plus size={20} />
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="上传照片">
        <PhotoUpload onUploaded={() => setOpen(false)} />
      </Modal>
    </>
  );
}
