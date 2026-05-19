"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
    if (!lightbox) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
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

  const lightboxContent =
    lightbox && typeof document !== "undefined"
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={photo.caption || "照片预览"}
            className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-stone-900/85 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              onClick={() => setLightbox(false)}
            >
              <X size={20} />
            </button>

            <div className="flex min-h-0 flex-1 items-center justify-center p-4 pb-3 pt-16">
              <img
                src={photo.url}
                alt={photo.caption || "照片"}
                className="max-h-[calc(100dvh-8rem)] max-w-[calc(100vw-2rem)] select-none rounded-xl object-contain"
                draggable={false}
                onClick={(event) => event.stopPropagation()}
              />
            </div>

            {photo.caption && (
              <div
                className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
                onClick={(event) => event.stopPropagation()}
              >
                <p className="mx-auto line-clamp-3 max-w-md break-words rounded-2xl bg-stone-900/60 px-4 py-2 text-center text-sm text-white backdrop-blur-sm">
                  {photo.caption}
                </p>
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-2xl"
        onClick={() => setLightbox(true)}
      >
        <img
          src={photo.url}
          alt={photo.caption || "照片"}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {photo.caption && (
              <p className="line-clamp-2 text-sm text-white">{photo.caption}</p>
            )}
          </div>
        </div>
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          className="absolute right-2 top-2 rounded-full bg-stone-900/30 p-1.5 text-white opacity-100 backdrop-blur-sm transition hover:bg-red-500/80 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {lightboxContent}
    </>
  );
}
