import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary text-secondary-foreground",
        breaking: "border-red-500/30 bg-red-500/10 text-red-400",
        medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        low: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        high: "border-red-500/40 bg-red-500/15 text-red-300",
        ai: "border-violet-500/30 bg-violet-500/10 text-violet-300",
        ok: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
        muted: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
