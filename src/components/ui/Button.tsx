import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        variant === "primary" &&
          "bg-warm-500 text-white hover:bg-warm-600 active:scale-95 shadow-sm",
        variant === "secondary" &&
          "border border-warm-300 text-warm-700 hover:bg-warm-100 active:scale-95",
        variant === "ghost" &&
          "text-stone-500 hover:text-warm-600 hover:bg-warm-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
