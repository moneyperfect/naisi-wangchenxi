import Link from "next/link";
import { Calendar, Image, Clock, Mail, Gamepad2, BookHeart } from "lucide-react";

const links = [
  {
    href: "/diary",
    icon: BookHeart,
    title: "日记",
    desc: "日常点滴",
    color: "bg-pink-50 text-pink-500",
  },
  {
    href: "/anniversary",
    icon: Calendar,
    title: "纪念日",
    desc: "重要的日子",
    color: "bg-rose-50 text-rose-500",
  },
  {
    href: "/album",
    icon: Image,
    title: "相册",
    desc: "美好瞬间",
    color: "bg-amber-50 text-amber-500",
  },
  {
    href: "/timeline",
    icon: Clock,
    title: "时间线",
    desc: "我们的故事",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    href: "/letters",
    icon: Mail,
    title: "情书",
    desc: "想对你说",
    color: "bg-sky-50 text-sky-500",
  },
  {
    href: "/games",
    icon: Gamepad2,
    title: "游戏",
    desc: "测测默契",
    color: "bg-violet-50 text-violet-500",
  },
];

export function QuickLinks() {
  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
        {links.map(({ href, icon: Icon, title, desc, color }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-warm-200/30 hover:border-warm-300/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className={`inline-flex p-2.5 rounded-xl ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <h3 className="font-serif font-semibold text-stone-800 text-sm">
              {title}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
