import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation";
    
    const variantClasses = {
      primary: "bg-warm-500 text-white hover:bg-warm-600 active:scale-95",
      secondary: "bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95",
      ghost: "text-stone-600 hover:bg-stone-100 active:scale-95",
    };
    
    const sizeClasses = {
      sm: "h-9 px-3 text-sm min-h-[44px] min-w-[44px]",
      md: "h-11 px-4 text-base min-h-[44px] min-w-[44px]",
      lg: "h-12 px-6 text-lg min-h-[44px] min-w-[44px]",
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };