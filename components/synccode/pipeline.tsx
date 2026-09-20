import { Check, Loader2, Circle, OctagonX } from "lucide-react";
import { PIPELINE_STEPS } from "@/lib/domain";
import { cn } from "@/lib/utils";

export function ChangePipeline({
  activeStage,
  completed,
  compact = false,
}: {
  activeStage: number;
  completed: number[];
  compact?: boolean;
}) {
  return (
    <ol className="relative" aria-label="Change pipeline">
      {PIPELINE_STEPS.map((s, i) => {
        const done = completed.includes(i);
        const active = i === activeStage;
        const pending = !done && !active;
        return (
          <li key={s.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* rail */}
            {i < PIPELINE_STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-6 left-[11px] h-[calc(100%-20px)] w-px",
                  done ? "bg-emerald-400/50" : active ? "bg-violet-400/50" : "bg-white/10"
                )}
              />
            )}
            <span
              className={cn(
                "z-10 flex size-6 shrink-0 items-center justify-center rounded-full border",
                done && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                active && "border-violet-400/50 bg-violet-400/10 text-violet-200",
                pending && "border-white/10 bg-white/[0.02] text-white/30"
              )}
            >
              {done ? (
                <Check className="size-3" />
              ) : active ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Circle className="size-2.5" />
              )}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={cn(
                    "text-[11px] font-semibold tracking-[0.1em] uppercase",
                    done ? "text-emerald-200/90" : active ? "text-violet-100" : "text-muted-foreground/70"
                  )}
                >
                  {s.label}
                </p>
                {!compact && (
                  <span className="sc-mono truncate text-[10px] text-muted-foreground/70">{s.hint}</span>
                )}
              </div>
              {active && (
                <p className="sc-rise mt-0.5 text-xs text-violet-200/80">
                  {i === 0 && "Listening to push webhook…"}
                  {i === 1 && "Mapping consumers across dependency graph…"}
                  {i === 2 && "Sync AI writing downstream patch…"}
                  {i === 3 && "Running typecheck + regression suite…"}
                  {i === 4 && "Evaluating autonomy policy…"}
                  {i === 5 && "Preparing merge + deploy plan…"}
                </p>
              )}
            </div>
            {active && <span className="sc-pulse-dot mt-1.5 size-1.5 rounded-full bg-violet-400" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

export function PipelineStrip({ activeStage, completed }: { activeStage: number; completed: number[] }) {
  return (
    <div className="flex items-center gap-1" role="list" aria-label="Pipeline progress">
      {PIPELINE_STEPS.map((s, i) => {
        const done = completed.includes(i);
        const active = i === activeStage;
        return (
          <div key={s.id} role="listitem" title={s.label} className="flex flex-1 items-center gap-1">
            <span
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                done ? "bg-emerald-400/80" : active ? "bg-violet-400" : "bg-white/10"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

export function BlockedNotice() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-500/25 bg-red-500/[0.07] p-2.5">
      <OctagonX className="mt-0.5 size-3.5 shrink-0 text-red-300" />
      <p className="text-xs leading-relaxed text-red-200/90">
        Automatic integration blocked. Policy requires human approval for payment-path mutations.
      </p>
    </div>
  );
}
