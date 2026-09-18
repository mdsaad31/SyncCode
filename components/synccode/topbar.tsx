"use client";

import { useState } from "react";
import { Menu, Play, Search, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/primitives";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Topbar({ onMenu, onPalette }: { onMenu: () => void; onPalette: () => void }) {
  const { runDemo, phase, reset } = useDemo();
  const [confirmHigh, setConfirmHigh] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-white/[0.06] bg-[#0a0a0b]/85 px-3 backdrop-blur-md sm:px-4">
      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground lg:hidden" onClick={onMenu} aria-label="Open navigation">
        <Menu className="size-4" />
      </button>

      <button
        onClick={onPalette}
        className="flex h-8 w-full max-w-[300px] items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 text-xs text-muted-foreground transition-colors hover:border-white/15 hover:text-foreground"
        aria-label="Open command palette"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search changes, repos, owners…</span>
        <span className="hidden items-center gap-0.5 sm:flex"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <span className={cn("sc-mono hidden rounded border px-1.5 py-1 text-[10px] md:block", phase === "running" ? "border-violet-400/30 text-violet-200" : "border-white/10 text-muted-foreground")}>
          {phase === "running" ? "● LIVE DEMO" : phase === "done" ? "● DEMO COMPLETE" : phase === "blocked" ? "● APPROVAL NEEDED" : "○ ENGINE IDLE"}
        </span>
        {phase !== "idle" ? (
          <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
        ) : null}
        <Button
          size="sm"
          variant="outline"
          className="hidden sm:inline-flex"
          onClick={() => {
            if (!confirmHigh) {
              setConfirmHigh(true);
              window.setTimeout(() => setConfirmHigh(false), 3000);
              return;
            }
            setConfirmHigh(false);
            runDemo("high-risk");
          }}
        >
          <TriangleAlert className="size-3.5 text-amber-300" />
          {confirmHigh ? "Confirm high-risk?" : "High-risk"}
        </Button>
        <Button size="sm" onClick={() => runDemo("breaking")}>
          <Play className="size-3.5" /> Simulate breaking change
        </Button>
      </div>
    </header>
  );
}
