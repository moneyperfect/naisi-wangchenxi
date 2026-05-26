import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({ title, showBack = false, action }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-warm-50/95 border-b border-warm-200/30">
      <div className="mx-auto max-w-lg flex items-center justify-between h-14 px-4">
        {showBack ? (
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 hover:text-warm-600 hover:bg-warm-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
        ) : (
          <div className="w-9" />
        )}
        <h1 className="text-lg font-serif font-semibold text-stone-800">
          {title}
        </h1>
        <div className="w-9 min-w-[44px] min-h-[44px] flex items-center justify-center">{action}</div>
      </div>
    </div>
  );
}
