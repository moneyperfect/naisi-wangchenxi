"use client";

import { useState, useRef, useEffect } from "react";
import { ImagePlus, Loader2, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { addPhoto } from "@/lib/actions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.8;

interface SelectedFile {
  id: string;
  file: File;
  preview: string;
  caption: string;
  status: "pending" | "uploading" | "done" | "error";
}

interface PhotoUploadProps {
  onUploaded?: () => void;
}

async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/jpeg", JPEG_QUALITY)
  );

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

export function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<SelectedFile[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<SelectedFile[]>([]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  async function handleFileSelect(files: FileList | null) {
    if (!files) return;
    const newItems: SelectedFile[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: 不支持的文件格式`);
        continue;
      }

      try {
        const compressed = await compressImage(file);
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: compressed,
          preview: URL.createObjectURL(compressed),
          caption: "",
          status: "pending",
        });
      } catch {
        toast.error(`${file.name}: 处理失败`);
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }

  async function handleUpload() {
    if (items.length === 0) return;
    setUploading(true);
    let successCount = 0;

    for (const item of items) {
      if (item.status === "done") continue;

      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: "uploading" as const } : it
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (data.url) {
          await addPhoto({
            url: data.url,
            caption: item.caption || undefined,
          });
          successCount++;
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, status: "done" as const } : it
            )
          );
        } else {
          throw new Error(data.error || "上传失败");
        }
      } catch {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: "error" as const } : it
          )
        );
        toast.error(`${item.file.name} 上传失败`);
      }
    }

    if (successCount > 0) {
      toast.success(`成功上传 ${successCount} 张照片`);
    }

    const hasErrors = items.some((it) => it.status === "error");
    if (!hasErrors) {
      items.forEach((it) => URL.revokeObjectURL(it.preview));
      setItems([]);
      setUploading(false);
      onUploaded?.();
    } else {
      setUploading(false);
    }
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((it) => it.id !== id);
    });
  }

  function updateCaption(id: string, caption: string) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, caption } : it))
    );
  }

  return (
    <div className="space-y-4 overflow-hidden">
      {items.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-warm-300/50 rounded-2xl p-8 text-center cursor-pointer hover:border-warm-400 hover:bg-warm-100/30 transition-all"
        >
          <ImagePlus className="mx-auto text-warm-400 mb-2" size={32} />
          <p className="text-sm text-stone-500">点击选择照片</p>
          <p className="text-xs text-stone-400 mt-1">支持 JPG、PNG、WebP、GIF</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="max-h-60 overflow-y-auto space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white rounded-xl p-2 border border-warm-200/30"
              >
                <img
                  src={item.preview}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 truncate">
                    {(item.file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => updateCaption(item.id, e.target.value)}
                    placeholder="写点备注..."
                    className="w-full text-xs mt-1 px-2 py-1 rounded-lg bg-warm-50 border border-warm-200/50 focus:outline-none focus:border-warm-400 transition-all"
                  />
                </div>
                {item.status === "done" ? (
                  <Check size={16} className="text-green-500 shrink-0" />
                ) : item.status === "error" ? (
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                ) : item.status === "uploading" ? (
                  <Loader2 size={16} className="animate-spin text-warm-400 shrink-0" />
                ) : (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-300 hover:text-red-400 shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl border border-warm-300 text-warm-600 text-sm font-medium hover:bg-warm-50 transition-colors disabled:opacity-50"
            >
              继续添加
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || items.every((it) => it.status === "done")}
              className="flex-1 py-2.5 rounded-xl bg-warm-500 text-white text-sm font-medium hover:bg-warm-600 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  上传中...
                </span>
              ) : items.some((it) => it.status === "error") ? (
                "重试失败项"
              ) : (
                `上传 ${items.filter((it) => it.status === "pending").length} 张照片`
              )}
            </button>
          </div>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFileSelect(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
