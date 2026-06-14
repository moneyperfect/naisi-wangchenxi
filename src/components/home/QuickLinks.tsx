"use client";

import Link from "next/link";
import { Image, BookOpen, HelpCircle, MoreHorizontal, Heart, Dices } from "lucide-react";

const quickLinks = [
  { href: "/album", label: "相册", icon: Image, color: "bg-pink-100 text-pink-500" },
  { href: "/rant", label: "倾诉", icon: BookOpen, color: "bg-blue-100 text-blue-500" },
  { href: "/daily", label: "今日一问", icon: HelpCircle, color: "bg-emerald-100 text-emerald-500" },
  { href: "/more", label: "更多", icon: MoreHorizontal, color: "bg-stone-100 text-stone-500" },
  { href: "/wishlist", label: "心愿", icon: Heart, color: "bg-orange-100 text-orange-500" },
  { href: "/date-idea", label: "约会", icon: Dices, color: "bg-purple-100 text-purple-500" },
];

export function QuickLinks() {
  return (
    <section className="px-4 py-6">
      <h2 className="font-serif text-xl font-semibold text-stone-800 mb-4">快速入口</h2>
      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-3 transition-all hover:scale-105 active:scale-95 min-w-[44px] min-h-[44px] ${link.color}`}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}