"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deletePhoto, updatePhotoCaption } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import type { Photo } from "@/types";

interface PhotoCardProps {
  photo: Photo;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const [lightbox, setLightbox] = useState(false);
  const [caption, setCaption] = useState(photo.caption);
  const [captionDraft, setCaptionDraft] = useState(photo.caption ?? "");
  const [editOpen, setEditOpen] = useState(false);
  const [savingCaption, setSavingCaption] = useState(false);

  useEffect(() => {
    if (!lightbox) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
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

  function openCaptionEditor() {
    setCaptionDraft(caption ?? "");
    setEditOpen(true);
  }

  async function handleSaveCaption() {
    setSavingCaption(true);
    try {
      const nextCaption = captionDraft.trim();
      await updatePhotoCaption(photo.id, nextCaption);
      setCaption(nextCaption || null);
      setEditOpen(false);
      toast.success(nextCaption ? "备注已更新" : "备注已清空");
    } catch {
      toast.error("备注保存失败");
    } finally {
      setSavingCaption(false);
    }
  }

  const lightboxContent =
    lightbox && typeof document !== "undefined"
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={caption || "照片预览"}
            className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-gradient-to-br from-cream/95 via-warm-50/95 to-warm-100/95"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute right-16 top-4 z-10 rounded-full bg-cream/85 p-2 text-stone-600 shadow-sm transition-colors hover:bg-warm-100"
              onClick={(event) => {
                event.stopPropagation();
                openCaptionEditor();
              }}
              title="编辑备注"
            >
              <Pencil size={18} />
            </button>
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-cream/85 p-2 text-stone-600 shadow-sm transition-colors hover:bg-warm-100"
              onClick={() => setLightbox(false)}
            >
              <X size={20} />
            </button>

            <div className="flex min-h-0 flex-1 items-center justify-center p-4 pb-3 pt-16">
              <img
                src={photo.url}
                alt={caption || "照片"}
                className="max-w-[calc(100vw-2rem)] select-none rounded-xl object-contain shadow-xl shadow-stone-900/10"
                style={{ maxHeight: "calc(100dvh - 8rem)" }}
                draggable={false}
                onClick={(event) => event.stopPropagation()}
              />
            </div>

            <div
              className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
              onClick={(event) => event.stopPropagation()}
            >
              {caption ? (
                <p className="mx-auto max-h-[28vh] max-w-md overflow-y-auto break-words rounded-2xl border border-warm-200/70 bg-cream/95 px-4 py-3 text-left text-sm leading-6 text-stone-700 shadow-lg shadow-stone-900/10">
                  {caption}
                </p>
              ) : (
                <button
                  onClick={openCaptionEditor}
                  className="mx-auto block rounded-full border border-warm-200 bg-cream/90 px-4 py-2 text-sm font-medium text-warm-600 shadow-sm transition-colors hover:bg-warm-50"
                >
                  添加备注
                </button>
              )}
            </div>
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
          alt={caption || "照片"}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-warm-100/95 via-warm-50/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {caption && (
              <p className="line-clamp-2 rounded-xl bg-cream/90 px-3 py-2 text-sm leading-5 text-stone-700 shadow-sm ">
                {caption}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={(event) => {
            event.stopPropagation();
            openCaptionEditor();
          }}
          className="absolute left-2 top-2 rounded-full bg-cream/85 p-1.5 text-stone-600 opacity-100 shadow-sm  transition hover:bg-warm-100 sm:opacity-0 sm:group-hover:opacity-100"
          title="编辑备注"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          className="absolute right-2 top-2 rounded-full bg-stone-900/30 p-1.5 text-white opacity-100  transition hover:bg-red-500/80 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {lightboxContent}

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑照片备注"
      >
        <div className="space-y-4">
          <textarea
            value={captionDraft}
            onChange={(event) => setCaptionDraft(event.target.value)}
            placeholder="写下这张照片里的小故事..."
            rows={6}
            className="max-h-[38vh] min-h-32 w-full resize-y rounded-2xl border border-warm-200 bg-cream px-4 py-3 text-sm leading-6 text-stone-700 placeholder:text-stone-300 focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-200"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="flex-1 rounded-2xl border border-warm-200 px-4 py-3 text-sm font-medium text-stone-500 transition-colors hover:bg-warm-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveCaption}
              disabled={savingCaption}
              className="flex-1 rounded-2xl bg-warm-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-warm-600 disabled:opacity-60"
            >
              {savingCaption ? (
                <Loader2 size={16} className="mx-auto animate-spin" />
              ) : (
                "保存"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
