"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShieldAlert, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionLabel, Separator } from "@/components/ui/primitives";
import { DiffView } from "@/components/synccode/ai-log";
import { RiskBadge } from "@/components/synccode/risk";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ApprovalsPage() {
  const { changes, approvals, decideApproval } = useDemo();
  const change = changes.find((item) => item.id === "1042")!;
  const approval = approvals.find((item) => item.changeId === change.id)!;
  const showDiff = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Approvals</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">An engineering safety mechanism — SyncCode explains why a human is required.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <section className="sc-panel p-4" aria-label="Approval request">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="breaking">Medium risk</Badge>
            <RiskBadge risk="MEDIUM" />
            <span className="sc-mono ml-auto text-[11px] text-muted-foreground">#{change.num} · {change.sha}</span>
          </div>
          <h2 className="sc-mono mt-2 text-[16px] font-semibold">Backend API contract changed: {change.title}</h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sc-inset p-2.5">
              <SectionLabel>Affected</SectionLabel>
              <ul className="sc-mono mt-1.5 space-y-1 text-xs text-foreground/85">
                <li>frontend-web <span className="text-emerald-300">· patched ✓</span></li>
                <li>mobile-app <span className="text-amber-300">· awaiting approval</span></li>
              </ul>
            </div>
            <div className="sc-inset p-2.5">
              <SectionLabel>AI generated</SectionLabel>
              <ul className="mt-1.5 space-y-1 text-xs text-foreground/85">
                <li className="flex items-center gap-1.5"><Check className="size-3 text-emerald-300" /> downstream patch</li>
                <li className="flex items-center gap-1.5"><Check className="size-3 text-emerald-300" /> regression tests (18/18)</li>
              </ul>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-400/[0.06] p-2.5">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <p className="text-xs leading-relaxed text-amber-100/85">
              <strong className="font-semibold">Human approval required because:</strong> business-logic modification detected in the User response contract.
              Payment-adjacent identity fields fall under the medium-risk policy — auto-merge is disabled until an owner signs off.
            </p>
          </div>

          {(showDiff[0] || approval.status !== "pending") && (
            <div className="sc-rise mt-3 space-y-2">
              {change.diff.map((d) => (
                <DiffView key={d.file} file={d.file} removed={d.removed} added={d.added} />
              ))}
            </div>
          )}

          <Separator className="my-3 opacity-60" />
          {approval.status === "approved" ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/[0.07] p-3 text-xs text-emerald-100" role="status">
              <Check className="size-4" /> Mobile patch approved — integration queued. Sara has been notified.
            </div>
          ) : approval.status === "rejected" ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/[0.07] p-3 text-xs text-red-100" role="status">
              <X className="size-4" /> Change sent back to Rahul with AI-generated context attached.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => showDiff[1](!showDiff[0])}>{showDiff[0] ? "Hide diff" : "Review diff"}</Button>
              <Button size="sm" onClick={() => decideApproval("approved")}><Check className="size-3.5" /> Approve</Button>
              <Button size="sm" variant="destructive" onClick={() => decideApproval("rejected")}><X className="size-3.5" /> Reject</Button>
            </div>
          )}
        </section>

        <div className="space-y-4">
          <section className="sc-panel p-3.5" aria-label="Policy">
            <SectionLabel>Risk-tiered autonomy</SectionLabel>
            <ul className="mt-2 space-y-2 text-xs">
              {[
                { r: "LOW", d: "Auto-integrate · tests must pass", c: "bg-emerald-400" },
                { r: "MEDIUM", d: "Require 1 owner approval", c: "bg-amber-300" },
                { r: "HIGH", d: "Block auto-merge · require review", c: "bg-red-400" },
              ].map((p) => (
                <li key={p.r} className="flex items-center gap-2">
                  <span className={cn("size-1.5 rounded-full", p.c)} />
                  <span className="sc-mono font-semibold">{p.r}</span>
                  <span className="text-muted-foreground">{p.d}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="sc-panel p-3.5" aria-label="Queue">
            <SectionLabel>Queue</SectionLabel>
            <ul className="mt-2 space-y-2 text-xs">
              <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-amber-300" /><span className="sc-mono">#1042 mobile patch</span><span className="ml-auto text-muted-foreground">waiting on you</span></li>
              <li className="flex items-center gap-2 opacity-60"><span className="size-1.5 rounded-full bg-emerald-400" /><span className="sc-mono">#1041 session TTL</span><span className="ml-auto text-muted-foreground">integrated</span></li>
              <li className="flex items-center gap-2 opacity-60"><span className="size-1.5 rounded-full bg-red-400" /><span className="sc-mono">#1040 charge() v2</span><span className="ml-auto text-muted-foreground">blocked</span></li>
            </ul>
            <Button size="sm" variant="outline" className="mt-3 w-full" asChild><Link href="/changes/1042">Open engineering workspace</Link></Button>
          </section>
        </div>
      </div>
    </div>
  );
}
