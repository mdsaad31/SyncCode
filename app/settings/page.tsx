import { SectionLabel } from "@/components/ui/primitives";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[19px] font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Autonomy policy, notifications, and environment.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="sc-panel p-3.5" aria-label="Autonomy">
          <SectionLabel>Autonomy policy</SectionLabel>
          <ul className="sc-mono mt-2 space-y-1.5 text-xs text-foreground/85">
            <li>LOW risk → auto-integrate</li>
            <li>MEDIUM risk → 1 owner approval</li>
            <li>HIGH risk → block + require review</li>
            <li>payment/* → always require human</li>
          </ul>
        </section>
        <section className="sc-panel p-3.5" aria-label="Environment">
          <SectionLabel>Environment</SectionLabel>
          <ul className="sc-mono mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>env: production · eu-west</li>
            <li>repos: 4 connected · webhooks healthy</li>
            <li>theme: dark-first · Geist + Geist Mono</li>
            <li>demo: deterministic · no network calls</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
