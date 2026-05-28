"use client";

import { useState, useEffect } from "react";
import { Swords, Plus, Send, X } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE, DEBATE_TOPICS } from "@/lib/constants";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Debate, DebateArgument } from "@/types";

const STORAGE_KEY = "couple-debates";

type LocalDebate = Debate & { arguments: DebateArgument[] };

function loadDebates(): LocalDebate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDebates(debates: LocalDebate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(debates));
}

export function DebateClient() {
  const [debates, setDebates] = useState<LocalDebate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [activeDebate, setActiveDebate] = useState<number | null>(null);
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [argument, setArgument] = useState("");
  const [author, setAuthor] = useState<"A" | "B">("A");

  useEffect(() => {
    setDebates(loadDebates());
  }, []);

  function handleCreateRandom() {
    const idx = Math.floor(Math.random() * DEBATE_TOPICS.length);
    const topic = DEBATE_TOPICS[idx];
    const newDebate: LocalDebate = {
      id: Date.now(),
      topic: topic.topic,
      optionA: topic.optionA,
      optionB: topic.optionB,
      createdAt: new Date(),
      arguments: [],
    };
    const updated = [newDebate, ...debates];
    saveDebates(updated);
    setDebates(updated);
    toast.success("辩题已创建！");
  }

  function handleCreateCustom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const topic = form.get("topic") as string;
    const optionA = form.get("optionA") as string;
    const optionB = form.get("optionB") as string;
    const newDebate: LocalDebate = {
      id: Date.now(),
      topic,
      optionA,
      optionB,
      createdAt: new Date(),
      arguments: [],
    };
    const updated = [newDebate, ...debates];
    saveDebates(updated);
    setDebates(updated);
    setShowForm(false);
    toast.success("辩题已创建！");
  }

  function handleSubmitArgument(debateId: number, side: string) {
    if (!argument.trim()) {
      toast.error("请写下你的论点");
      return;
    }
    const newArg: DebateArgument = {
      id: Date.now(),
      debateId,
      author,
      side,
      argument: argument.trim(),
      createdAt: new Date(),
    };
    const updated = debates.map((d) =>
      d.id === debateId ? { ...d, arguments: [...d.arguments, newArg] } : d
    );
    saveDebates(updated);
    setDebates(updated);
    setArgument("");
    setSelectedSide(null);
    setActiveDebate(null);
    toast.success("论点已提交！");
  }

  function handleDelete(id: number) {
    if (!window.confirm("确定要删除这个辩题吗？")) return;
    const updated = debates.filter((d) => d.id !== id);
    saveDebates(updated);
    setDebates(updated);
    toast.success("已删除");
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-500">
          <Swords size={40} />
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800">辩论场</h2>
        <p className="text-sm text-stone-400">选边站，写论点，用逻辑征服对方</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCreateRandom}
          className="flex-1 py-3 rounded-2xl bg-amber-500 text-white font-medium hover:bg-amber-600 active:scale-95 transition-all"
        >
          随机辩题
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex-1 py-3 rounded-2xl border border-amber-300 text-amber-600 font-medium hover:bg-amber-50 active:scale-95 transition-all"
        >
          {showForm ? "收起" : "自定义辩题"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateCustom}
          className="space-y-3 p-4 rounded-2xl bg-amber-50 border border-amber-200"
        >
          <input
            name="topic"
            required
            placeholder="辩题（如：甜粽子 vs 咸粽子）"
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-all"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              name="optionA"
              required
              placeholder="选项A"
              className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-all"
            />
            <input
              name="optionB"
              required
              placeholder="选项B"
              className="px-4 py-2.5 rounded-xl bg-white border border-amber-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-all"
          >
            创建辩题
          </button>
        </form>
      )}

      {debates.length === 0 ? (
        <EmptyState
          icon={<Swords size={32} />}
          title="还没有辩题"
          description="来一场酣畅淋漓的思维碰撞吧"
        />
      ) : (
        <div className="space-y-4">
          {debates.map((debate, i) => {
            const argsA = debate.arguments.filter((a) => a.side === "A");
            const argsB = debate.arguments.filter((a) => a.side === "B");
            const isActive = activeDebate === debate.id;

            return (
              <div
                key={debate.id}
                className="rounded-3xl border border-amber-200/50 bg-white/60 overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="p-4 bg-amber-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-semibold text-stone-800">
                      {debate.topic}
                    </h3>
                    <button
                      onClick={() => handleDelete(debate.id)}
                      className="p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    {formatDate(debate.createdAt.toString())}
                  </p>
                </div>

                <div className="grid grid-cols-2 divide-x divide-amber-200/50">
                  <button
                    onClick={() => {
                      setActiveDebate(isActive ? null : debate.id);
                      setSelectedSide(isActive ? null : "A");
                    }}
                    className={cn(
                      "p-3 text-center transition-all",
                      isActive && selectedSide === "A"
                        ? "bg-amber-100"
                        : "hover:bg-amber-50/50"
                    )}
                  >
                    <p className="text-xs text-stone-400 mb-1">正方</p>
                    <p className="text-sm font-medium text-stone-700">
                      {debate.optionA}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {argsA.length} 条论点
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setActiveDebate(isActive ? null : debate.id);
                      setSelectedSide(isActive ? null : "B");
                    }}
                    className={cn(
                      "p-3 text-center transition-all",
                      isActive && selectedSide === "B"
                        ? "bg-amber-100"
                        : "hover:bg-amber-50/50"
                    )}
                  >
                    <p className="text-xs text-stone-400 mb-1">反方</p>
                    <p className="text-sm font-medium text-stone-700">
                      {debate.optionB}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {argsB.length} 条论点
                    </p>
                  </button>
                </div>

                {debate.arguments.length > 0 && (
                  <div className="p-4 space-y-2 border-t border-amber-200/30">
                    {debate.arguments.map((arg) => {
                      const authorName =
                        arg.author === "A" ? COUPLE.partnerA : COUPLE.partnerB;
                      return (
                        <div
                          key={arg.id}
                          className={cn(
                            "p-3 rounded-xl text-sm",
                            arg.side === "A"
                              ? "bg-amber-50 text-stone-700"
                              : "bg-orange-50 text-stone-700"
                          )}
                        >
                          <span className="text-xs font-medium text-stone-400">
                            {authorName}（
                            {arg.side === "A" ? debate.optionA : debate.optionB}）：
                          </span>
                          <p className="mt-1">{arg.argument}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isActive && selectedSide && (
                  <div className="p-4 border-t border-amber-200/30 space-y-3">
                    <div className="flex gap-2">
                      {(["A", "B"] as const).map((side) => (
                        <button
                          key={side}
                          onClick={() => setSelectedSide(side)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-xs font-medium transition-all",
                            selectedSide === side
                              ? "bg-amber-500 text-white"
                              : "bg-amber-50 text-stone-500 hover:bg-amber-100"
                          )}
                        >
                          {side === "A" ? debate.optionA : debate.optionB}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value as "A" | "B")}
                        className="px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm text-stone-600 focus:outline-none"
                      >
                        <option value="A">{COUPLE.partnerA}</option>
                        <option value="B">{COUPLE.partnerB}</option>
                      </select>
                      <input
                        value={argument}
                        onChange={(e) => setArgument(e.target.value)}
                        placeholder="写下你的论点..."
                        className="flex-1 px-4 py-2 rounded-xl bg-white border border-amber-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-amber-400 transition-all"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmitArgument(debate.id, selectedSide);
                          }
                        }}
                      />
                      <button
                        onClick={() =>
                          handleSubmitArgument(debate.id, selectedSide)
                        }
                        className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
