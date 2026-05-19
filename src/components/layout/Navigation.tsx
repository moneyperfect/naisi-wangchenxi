"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  CalendarHeart,
  Image,
  MessageCircleHeart,
  MoreHorizontal,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", icon: Heart, label: "首页" },
  { href: "/story", icon: BookOpen, label: "故事" },
  { href: "/anniversary", icon: CalendarHeart, label: "纪念日" },
  { href: "/album", icon: Image, label: "相册" },
  { href: "/notes", icon: MessageCircleHeart, label: "心里话" },
  { href: "/more", icon: MoreHorizontal, label: "更多" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-warm-200/50">
      <div className="mx-auto max-w-lg flex justify-around items-center h-16 px-1">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-all duration-200",
                isActive
                  ? "text-warm-600 scale-105"
                  : "text-stone-400 hover:text-warm-500"
              )}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
