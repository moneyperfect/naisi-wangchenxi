import { COUPLE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Heart } from "lucide-react";
import { LoveQuote } from "./LoveQuote";

export function HeroSection() {
  return (
    <div className="text-center pt-12 pb-2 px-4">
      <div className="inline-flex items-center gap-2 text-warm-400 mb-4">
        <div className="h-px w-12 bg-warm-300/50" />
        <Heart size={16} fill="currentColor" />
        <div className="h-px w-12 bg-warm-300/50" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-stone-800 mb-2">
        {COUPLE.partnerA}
        <span className="text-warm-500 mx-2">&</span>
        {COUPLE.partnerB}
      </h1>
      <p className="text-sm text-stone-500">
        {formatDate(COUPLE.startDate)} 在一起
      </p>
      <LoveQuote />
    </div>
  );
}
