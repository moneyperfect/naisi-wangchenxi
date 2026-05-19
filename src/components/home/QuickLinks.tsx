import Link from "next/link";
import {
  BookOpen,
  CalendarHeart,
  Image,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";

const links = [
  {
    href: "/story",
    icon: BookOpen,
    title: "我们的故事",
    desc: "日常与重要节点",
    color: "bg-warm-50 text-warm-500",
  },
  {
    href: "/anniversary",
    icon: CalendarHeart,
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
    href: "/notes",
    icon: MessageCircleHeart,
    title: "心里话",
    desc: "想对你说",
    color: "bg-sky-50 text-sky-500",
  },
  {
    href: "/wishlist",
    icon: Sparkles,
    title: "心愿清单",
    desc: "想一起做的事",
    color: "bg-violet-50 text-violet-500",
  },
  {
    href: "/more",
    icon: MessageCircleHeart,
    title: "更多",
    desc: "随机约会·今日一问",
    color: "bg-emerald-50 text-emerald-500",
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
            className="group bg-white/60 backdrop-blur-sm rounded-3xl p-5 border border-warm-200/30 hover:border-warm-300/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
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
