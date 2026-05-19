"use client";

import { useState, useEffect } from "react";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deletePhoto } from "@/lib/actions";
import type { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [lightbox]);

  async function handleDelete() {
    if (!window.confirm("确定要删除这张照片吗？")) return;
    try {
      await deletePhoto(photo.id);
      toast.success("照片已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div
        className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid"
        onClick={() => setLightbox(true)}
      >
        <img
          src={photo.url}
          alt={photo.caption || "照片"}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {photo.caption && (
              <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-red-500/80 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4 overflow-hidden touch-none"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>
          <img
            src={photo.url}
            alt={photo.caption || "照片"}
            className="max-w-[calc(100vw-2rem)] max-h-[85vh] object-contain rounded-xl select-none"
            draggable={false}
          />
          {photo.caption && (
            <p className="absolute bottom-8 text-white text-center text-sm bg-stone-900/60 backdrop-blur-sm px-4 py-2 rounded-full max-w-[80vw]">
              {photo.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
