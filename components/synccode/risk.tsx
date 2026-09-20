import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/domain";

const map: Record<RiskLevel, { variant: "low" | "medium" | "high"; dot: string }> = {
  LOW: { variant: "low", dot: "bg-emerald-400" },
  MEDIUM: { variant: "medium", dot: "bg-amber-400" },
  HIGH: { variant: "high", dot: "bg-red-400" },
  CRITICAL: { variant: "high", dot: "bg-red-500" },
};

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  const m = map[risk];
  return (
    <Badge variant={m.variant} className={cn(className)}>
      <span className={cn("size-1.5 rounded-full", m.dot)} aria-hidden />
      {risk} risk
    </Badge>
  );
}

export function StatusDot({ tone }: { tone: "ok" | "warn" | "err" | "ai" | "idle" }) {
  const c = { ok: "bg-emerald-400", warn: "bg-amber-400", err: "bg-red-400", ai: "bg-violet-400", idle: "bg-white/20" }[tone];
  return <span className={cn("size-1.5 shrink-0 rounded-full", c)} aria-hidden />;
}
