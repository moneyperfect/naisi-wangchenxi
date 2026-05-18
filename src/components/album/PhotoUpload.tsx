"use client";

import { useState, useRef } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addPhoto } from "@/lib/actions";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface PhotoUploadProps {
  onUploaded?: () => void;
}

export function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<Record<number, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(files: FileList | null) {
    if (!files) return;
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: 不支持的文件格式`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name}: 文件太大（最大 10MB）`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) {
      setSelectedFiles((prev) => [...prev, ...valid]);
    }
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          await addPhoto({
            url: data.url,
            caption: captions[i] || undefined,
          });
          successCount++;
        }
      } catch {
        toast.error(`${file.name} 上传失败`);
      }
    }

    if (successCount > 0) {
      toast.success(`成功上传 ${successCount} 张照片`);
    }
    setSelectedFiles([]);
    setCaptions({});
    setUploading(false);
    onUploaded?.();
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setCaptions((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {selectedFiles.length === 0 ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-warm-300/50 rounded-2xl p-8 text-center cursor-pointer hover:border-warm-400 hover:bg-warm-100/30 transition-all"
        >
          <ImagePlus className="mx-auto text-warm-400 mb-2" size={32} />
          <p className="text-sm text-stone-500">点击或拖拽照片到这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white rounded-xl p-2 border border-warm-200/30"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 truncate">{file.name}</p>
                  <input
                    type="text"
                    value={captions[i] || ""}
                    onChange={(e) =>
                      setCaptions((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                    placeholder="写点备注..."
                    className="w-full text-xs mt-1 px-2 py-1 rounded-lg bg-warm-50 border border-warm-200/50 focus:outline-none focus:border-warm-400 transition-all"
                  />
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="text-stone-300 hover:text-red-400 text-xs shrink-0"
                >
                  移除
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2.5 rounded-xl bg-warm-500 text-white text-sm font-medium hover:bg-warm-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                上传中...
              </span>
            ) : (
              `上传 ${selectedFiles.length} 张照片`
            )}
          </button>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
}
