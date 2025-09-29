import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "./cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full border border-foreground/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30 bg-background shadow-sm",
          invalid ? "border-red-500" : "border-foreground/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
