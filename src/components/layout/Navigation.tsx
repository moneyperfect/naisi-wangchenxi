"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Calendar, Image, Clock, Mail, Gamepad2, BookHeart } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", icon: Heart, label: "首页" },
  { href: "/diary", icon: BookHeart, label: "日记" },
  { href: "/anniversary", icon: Calendar, label: "纪念日" },
  { href: "/album", icon: Image, label: "相册" },
  { href: "/timeline", icon: Clock, label: "时间线" },
  { href: "/letters", icon: Mail, label: "情书" },
  { href: "/games", icon: Gamepad2, label: "游戏" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-warm-200/50">
      <div className="mx-auto max-w-lg flex justify-around items-center h-16 px-1">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
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
