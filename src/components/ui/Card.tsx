import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-warm-200/30",
        className
      )}
    >
      {children}
    </div>
  );
}
