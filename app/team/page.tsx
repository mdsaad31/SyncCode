import { Avatar, SectionLabel } from "@/components/ui/primitives";
import { TEAM } from "@/lib/data";
import { cn } from "@/lib/utils";

const dot: Record<string, string> = { active: "bg-emerald-400", author: "bg-violet-400", review: "bg-amber-300", idle: "bg-white/25" };

export default function TeamPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Team</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Engineering ownership — who owns what, and what they are doing now.</p>
      </div>
      <section className="sc-panel overflow-hidden" aria-label="Team members">
        <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-white/[0.06] bg-white/[0.015] px-3.5 py-2 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase sm:grid-cols-[1.2fr_1.4fr_1fr_auto]">
          <span>Developer</span><span className="hidden sm:block">Owned components</span><span className="hidden sm:block">Current work</span><span className="text-right">Load</span>
        </div>
        <ul className="divide-y divide-white/[0.05]">
          {TEAM.map((t) => (
            <li key={t.name} className="grid grid-cols-[1fr_auto] items-center gap-2 px-3.5 py-2.5 sm:grid-cols-[1.2fr_1.4fr_1fr_auto]">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar initials={t.initials} color={t.color} className="size-7 text-[10px]" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[13px] font-medium">{t.name}<span className={cn("size-1.5 rounded-full", dot[t.state])} title={t.state} /></p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="hidden sm:block">
                {t.owns.map((o) => (
                  <p key={o} className="sc-mono truncate text-[11px] text-muted-foreground">{o}</p>
                ))}
              </div>
              <p className="hidden truncate text-xs text-foreground/80 sm:block">● {t.current}</p>
              <span className="sc-mono rounded bg-white/[0.06] px-1.5 py-0.5 text-right text-[11px] tabular-nums">{t.changes} active</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-[11px] text-muted-foreground"><span className="font-semibold tracking-[0.12em] uppercase"><SectionLabel>Ownership rule</SectionLabel></span><span className="mt-1 block">SyncCode routes every downstream file to exactly one owner. No orphaned impact, no broadcast noise.</span></p>
    </div>
  );
}
