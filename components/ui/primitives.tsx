import * as React from "react";
import { cn } from "@/lib/utils";

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="separator" role="separator" className={cn("h-px w-full bg-border", className)} {...props} />;
}

function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div data-slot="progress" className={cn("h-1 w-full overflow-hidden rounded-full bg-white/[0.07]", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-300 transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function Avatar({ initials, color, className }: { initials: string; color?: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] font-semibold", className)}
      style={{ background: `color-mix(in srgb, ${color ?? "#8b7cf6"} 22%, #121214)`, color: color ?? "#c4b5fd" }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd className={cn("sc-mono inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-white/[0.04] px-1 text-[10px] text-muted-foreground", className)}>
      {children}
    </kbd>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">{children}</p>;
}

export { Separator, Progress, Avatar, Kbd, SectionLabel };
