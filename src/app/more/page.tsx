import { PageHeader } from "@/components/layout/PageHeader";
import Link from "next/link";
import {
  Sparkles,
  HelpCircle,
  Dices,
  Gamepad2,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    href: "/wishlist",
    icon: Sparkles,
    title: "心愿清单",
    description: "想一起做的事",
    color: "bg-amber-50 text-amber-500",
  },
  {
    href: "/daily",
    icon: HelpCircle,
    title: "今日一问",
    description: "每天一个小问题",
    color: "bg-sky-50 text-sky-500",
  },
  {
    href: "/date-idea",
    icon: Dices,
    title: "随机约会",
    description: "摇一摇找点子",
    color: "bg-violet-50 text-violet-500",
  },
  {
    href: "/games",
    icon: Gamepad2,
    title: "默契测试",
    description: "测测我们的默契",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    href: "/rant",
    icon: MessageSquare,
    title: "吐槽墙",
    description: "有什么不满说出来",
    color: "bg-orange-50 text-orange-500",
  },
];

export default function MorePage() {
  return (
    <div>
      <PageHeader title="更多" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="bg-white/60 backdrop-blur-sm rounded-3xl p-5 border border-warm-200/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${f.color}`}
              >
                <f.icon size={20} />
              </div>
              <h3 className="font-serif font-semibold text-stone-800 text-sm">
                {f.title}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">{f.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
