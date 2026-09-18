import { Check, Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { SectionLabel } from "@/components/ui/primitives";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const toneIcon = {
  info: <span className="mt-1.5 size-1 rounded-full bg-white/30" aria-hidden />,
  ai: <Sparkles className="mt-0.5 size-3 shrink-0 text-violet-300" />,
  ok: <Check className="mt-0.5 size-3 shrink-0 text-emerald-300" />,
  warn: <TriangleAlert className="mt-0.5 size-3 shrink-0 text-amber-300" />,
  err: <TriangleAlert className="mt-0.5 size-3 shrink-0 text-red-300" />,
};

export function AIExecutionLog({ compact = false }: { compact?: boolean }) {
  const { logs, phase } = useDemo();
  const visible = compact ? logs.slice(-7) : logs;
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-md bg-violet-500/15 text-violet-200">
          <Sparkles className="size-3" />
        </span>
        <SectionLabel>Sync AI · execution log</SectionLabel>
        {phase === "running" && (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-violet-200/80">
            <Loader2 className="size-3 animate-spin" /> operating
          </span>
        )}
      </div>
      <ol className={cn("sc-mono mt-2 space-y-0 overflow-hidden rounded-lg border border-white/[0.07] bg-black/40", compact ? "text-[11px]" : "text-xs")}>
        {visible.map((l) => (
          <li key={l.id} className="sc-rise flex items-start gap-2 border-b border-white/[0.04] px-2.5 py-1.5 last:border-0">
            {toneIcon[l.tone]}
            <span className={cn("flex-1 leading-relaxed", l.tone === "err" ? "text-red-200" : l.tone === "ok" ? "text-emerald-100/90" : l.tone === "ai" ? "text-violet-100/90" : "text-white/60")}>
              {l.text}
            </span>
            <span className="shrink-0 text-[10px] text-white/25">{l.time}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function DiffView({ removed, added, file }: { removed: string[]; added: string[]; file: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-black/50">
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
        <span className="size-2 rounded-full bg-red-400/70" aria-hidden />
        <span className="size-2 rounded-full bg-amber-300/70" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400/70" aria-hidden />
        <span className="sc-mono ml-1 text-[11px] text-muted-foreground">{file}</span>
      </div>
      <div className="sc-mono overflow-x-auto p-0 text-[12px] leading-6">
        {removed.map((l, i) => (
          <div key={`r${i}`} className="flex gap-3 bg-red-500/[0.08] px-3 text-red-200/90">
            <span className="w-4 shrink-0 text-red-400/70 select-none">−</span><span className="whitespace-pre">{l}</span>
          </div>
        ))}
        {added.map((l, i) => (
          <div key={`a${i}`} className="flex gap-3 bg-emerald-500/[0.08] px-3 text-emerald-100/90">
            <span className="w-4 shrink-0 text-emerald-400/70 select-none">+</span><span className="whitespace-pre">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
