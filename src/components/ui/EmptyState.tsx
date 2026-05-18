import { Heart } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-warm-100 text-warm-400 mb-4">
        {icon || <Heart size={32} />}
      </div>
      <h3 className="font-serif text-lg font-semibold text-stone-700 mb-1">
        {title}
      </h3>
      <p className="text-sm text-stone-400 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}
