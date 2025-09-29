"use client";
import { ReactNode, useEffect } from "react";
import { cn } from "./cn";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  action,
}: DialogProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-sm rounded-xl border border-foreground/10 bg-background p-4 shadow-lg"
        )}
      >
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <div className="text-sm opacity-80">{children}</div>
        {action && <div className="mt-4 flex justify-end gap-2">{action}</div>}
      </div>
    </div>
  );
}
