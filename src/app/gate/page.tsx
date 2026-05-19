"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Heart, Lock } from "lucide-react";
import { COUPLE } from "@/lib/constants";

function GateForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "密码不对哦");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Lock
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="请输入密码"
          autoFocus
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all text-center text-lg tracking-widest"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 animate-shake">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password.trim()}
        className="w-full py-3.5 rounded-2xl bg-warm-500 text-white font-medium hover:bg-warm-600 active:scale-95 transition-all disabled:opacity-50"
      >
        {loading ? "验证中..." : "进入"}
      </button>
    </form>
  );
}

export default function GatePage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex p-4 rounded-full bg-warm-100 text-warm-500">
            <Heart size={36} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-800">
              {COUPLE.partnerA} & {COUPLE.partnerB}
            </h1>
            <p className="text-sm text-stone-400 mt-1">{COUPLE.siteTitle}</p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4 animate-pulse">
              <div className="h-14 bg-stone-100 rounded-2xl" />
              <div className="h-14 bg-stone-100 rounded-2xl" />
            </div>
          }
        >
          <GateForm />
        </Suspense>
      </div>
    </div>
  );
}
