import { Heart, Lock } from "lucide-react";
import { COUPLE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${COUPLE.partnerA} & ${COUPLE.partnerB}`,
  description: COUPLE.siteTitle,
};

type GatePageProps = {
  searchParams?: Promise<{
    from?: string;
    error?: string;
  }>;
};

function sanitizeRedirect(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default async function GatePage({ searchParams }: GatePageProps) {
  const params = await searchParams;
  const from = sanitizeRedirect(params?.from);
  const hasError = params?.error === "1";

  return (
    <div className="flex items-center justify-center bg-stone-50 p-4" style={{ minHeight: "100dvh" }}>
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-4">
          <div className="inline-flex rounded-full bg-warm-100 p-4 text-warm-500">
            <Heart size={36} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-800">
              {COUPLE.partnerA} & {COUPLE.partnerB}
            </h1>
            <p className="mt-1 text-sm text-stone-400">{COUPLE.siteTitle}</p>
          </div>
        </div>

        <form action="/api/gate" method="post" className="space-y-4">
          <input type="hidden" name="from" value={from} />

          <div className="relative">
            <Lock
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300"
            />
            <input
              name="password"
              type="password"
              placeholder="请输入密码"
              autoComplete="current-password"
              autoFocus
              required
              className="w-full rounded-2xl border border-warm-200 bg-white py-3.5 pl-10 pr-4 text-center text-lg tracking-widest text-stone-800 transition-all placeholder:text-stone-300 focus:border-warm-400 focus:outline-none focus:ring-2 focus:ring-warm-200"
            />
          </div>

          {hasError && (
            <p className="animate-shake text-sm text-red-400">密码不对哦</p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-warm-500 py-3.5 font-medium text-white transition-all hover:bg-warm-600 active:scale-95"
          >
            进入
          </button>
        </form>
      </div>
    </div>
  );
}
