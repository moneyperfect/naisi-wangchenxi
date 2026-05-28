"use client";

import { useState } from "react";
import { Download, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEYS: string[] = [];

export function DataManager() {
  const [importing, setImporting] = useState(false);

  function handleExport() {
    const data: Record<string, unknown> = {};
    for (const key of STORAGE_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          data[key] = JSON.parse(raw);
        } catch {
          data[key] = raw;
        }
      }
    }

    if (Object.keys(data).length === 0) {
      toast.error("没有可导出的数据");
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `couple-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("数据已导出");
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        for (const key of STORAGE_KEYS) {
          if (data[key]) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        }

        toast.success("数据已导入，页面将刷新");
        setTimeout(() => window.location.reload(), 1000);
      } catch {
        toast.error("导入失败，文件格式不正确");
      } finally {
        setImporting(false);
      }
    };
    input.click();
  }

  function handleClear() {
    if (!window.confirm("确定要清除所有本地数据吗？此操作不可撤销。")) return;
    for (const key of STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
    toast.success("数据已清除，页面将刷新");
    setTimeout(() => window.location.reload(), 1000);
  }

  return (
    <div className="space-y-3">
      <h3 className="font-serif font-semibold text-stone-800 text-sm">数据管理</h3>
      <p className="text-xs text-stone-400">辩论和挑战数据保存在本地，可导出备份</p>
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-warm-500 text-white text-sm font-medium hover:bg-warm-600 active:scale-95 transition-all"
        >
          <Download size={14} />
          导出
        </button>
        <button
          onClick={handleImport}
          disabled={importing}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-warm-200 text-stone-600 text-sm font-medium hover:bg-warm-50 active:scale-95 transition-all disabled:opacity-50"
        >
          <Upload size={14} />
          导入
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 active:scale-95 transition-all"
        >
          <Trash2 size={14} />
          清除
        </button>
      </div>
    </div>
  );
}
