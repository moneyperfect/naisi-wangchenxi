"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createGame } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ScoreCreateButtonProps {
  onCreated: () => void;
}

export function ScoreCreateButton({ onCreated }: ScoreCreateButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createGame(name.trim());
      toast.success("游戏已创建");
      setName("");
      setOpen(false);
      onCreated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-warm-500 text-white hover:bg-warm-600 transition-colors"
      >
        <Plus size={14} />
        新建游戏
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="新建计分游戏">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              游戏名称
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：乒乓球、猜拳..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleCreate}
              disabled={loading || !name.trim()}
              className="flex-1"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "创建"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
