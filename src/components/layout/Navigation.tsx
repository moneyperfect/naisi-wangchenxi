"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, BookOpen, Music, MoreHorizontal } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/rant", label: "倾诉", icon: BookOpen },
  { href: "/love", label: "爱情", icon: Heart },
  { href: "/music", label: "音乐", icon: Music },
  { href: "/more", label: "更多", icon: MoreHorizontal },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-stone-50/80 backdrop-blur-lg border-t border-stone-200 safe-area-bottom">
      <div className="mx-auto max-w-lg flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 transition-all min-w-[44px] min-h-[44px] ${
                isActive
                  ? "text-warm-500"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}