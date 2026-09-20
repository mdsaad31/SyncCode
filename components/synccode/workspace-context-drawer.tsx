"use client";

import { X } from "lucide-react";
import { SectionLabel } from "@/components/ui/primitives";
import { WORKSPACE_CONTEXT } from "@/lib/agent";
import { useDemo } from "@/lib/store";

export function WorkspaceContextDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { workspace } = useDemo();
  if (!open) return null;
  const context = { ...WORKSPACE_CONTEXT, ...workspace };
  return <div className="fixed inset-0 z-[75] flex justify-end bg-black/45" role="dialog" aria-modal="true" aria-label="Workspace context">
    <button className="absolute inset-0" onClick={onClose} aria-label="Close workspace context" />
    <section className="sc-rise relative h-full w-full max-w-[370px] border-l border-white/10 bg-[#141416] shadow-2xl"><header className="flex items-start border-b border-white/[0.07] px-4 py-4"><div><SectionLabel>Workspace context</SectionLabel><h2 className="mt-1 text-sm font-semibold">{context.project} / {context.repository}</h2></div><button onClick={onClose} className="ml-auto rounded p-1 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"><X className="size-4" /></button></header><div className="space-y-5 p-4"><dl className="divide-y divide-white/[0.06] border-y border-white/[0.06] text-[12px]">{[["Project", context.project], ["Repository", context.repository], ["Branch", context.branch], ["Developer", context.user], ["Active changes", "2"]].map(([label, value]) => <div key={label} className="flex justify-between py-2.5"><dt className="text-muted-foreground">{label}</dt><dd>{value}</dd></div>)}</dl><div><SectionLabel>Owned components</SectionLabel><div className="mt-2 flex flex-wrap gap-1.5">{context.ownedComponents.map((item) => <span key={item} className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px]">{item}</span>)}</div></div><div><SectionLabel>Dependencies</SectionLabel><div className="mt-2 flex flex-wrap gap-1.5">{context.dependencies.map((item) => <span key={item} className="rounded border border-amber-300/20 bg-amber-300/[0.05] px-2 py-1 text-[11px] text-amber-100">{item}</span>)}</div></div><div className="rounded-md border border-amber-300/25 bg-amber-300/[0.065] p-3"><SectionLabel>Current sync state</SectionLabel><p className="mt-1.5 flex items-center gap-2 text-[12px] font-semibold text-amber-100"><span className="size-1.5 rounded-full bg-amber-300" />{context.syncState}</p></div></div></section>
  </div>;
}
