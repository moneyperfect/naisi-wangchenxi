import { Suspense } from "react";
import { getWishlistItems } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { WishlistAddButton } from "./WishlistAddButton";
import { WishlistSkeleton } from "@/components/wishlist/WishlistSkeleton";
import { WishlistCard } from "@/components/wishlist/WishlistCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Sparkles } from "lucide-react";
import type { Wishlist } from "@/types";
import { PageWrapper } from "@/components/ui/PageWrapper";

export const dynamic = "force-dynamic";

const CATEGORY_ORDER = ["旅行", "美食", "体验", "其他"] as const;

const categoryColors: Record<string, string> = {
  "旅行": "bg-sky-100 text-sky-700",
  "美食": "bg-orange-100 text-orange-700",
  "体验": "bg-violet-100 text-violet-700",
  "其他": "bg-stone-200 text-stone-600",
};

function groupByCategory(items: Wishlist[]) {
  const active = items.filter((i) => !i.completed);
  const done = items.filter((i) => i.completed);

  const grouped: Record<string, Wishlist[]> = {};
  for (const cat of CATEGORY_ORDER) {
    const catItems = active.filter((i) => i.category === cat);
    if (catItems.length > 0) grouped[cat] = catItems;
  }
  // Remaining active items in categories not in CATEGORY_ORDER
  const remaining = active.filter(
    (i) => !CATEGORY_ORDER.includes(i.category as (typeof CATEGORY_ORDER)[number])
  );
  if (remaining.length > 0) {
    grouped["其他"] = [...(grouped["其他"] || []), ...remaining];
  }

  return { grouped, done };
}

async function WishlistContent() {
  const items = await getWishlistItems();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles size={32} />}
        title="心愿清单还是空的"
        description="许下你们一起想做的事，一个个去实现吧"
        action={<WishlistAddButton />}
      />
    );
  }

  const { grouped, done } = groupByCategory(items);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                categoryColors[category] || categoryColors["其他"]
              }`}
            >
              {category}
            </span>
            <span className="text-xs text-stone-400">{catItems.length} 个心愿</span>
          </div>
          <div className="space-y-2">
            {catItems.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.04}>
                <WishlistCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      ))}

      {done.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              已完成
            </span>
            <span className="text-xs text-stone-400">{done.length} 个心愿</span>
          </div>
          <div className="space-y-2">
            {done.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.04}>
                <WishlistCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <PageWrapper>
      <PageHeader title="心愿清单" showBack action={<WishlistAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<WishlistSkeleton />}>
          <WishlistContent />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
