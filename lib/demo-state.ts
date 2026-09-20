export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ChangeStatus =
  | "detected"
  | "analyzing"
  | "fixing"
  | "validating"
  | "awaiting-approval"
  | "integrating"
  | "integrated"
  | "blocked";
export type PipelineStage =
  | "detected"
  | "impact"
  | "fix"
  | "validation"
  | "risk"
  | "integration";

export interface Owner {
  name: string;
  role: string;
  initials: string;
  status: string;
  component: string;
}

export interface RepoConsumer {
  repo: string;
  component: string;
  owner: string;
  state: "patched" | "awaiting" | "healthy" | "affected" | "blocked";
  files: number;
}

export interface SyncChange {
  id: string;
  num: number;
  title: string;
  from: string;
  to: string;
  repo: string;
  author: string;
  authorRole: string;
  time: string;
  sha: string;
  risk: RiskLevel;
  status: ChangeStatus;
  breaking: boolean;
  files: string[];
  consumers: RepoConsumer[];
  aiActions: { label: string; state: "done" | "active" | "pending" | "blocked" }[];
  tests: { passed: number; total: number };
  reason: string;
  diff: { file: string; lang: string; removed: string[]; added: string[] }[];
}

export const TEAM = [
  { name: "Aqib", role: "Frontend Engineer", initials: "AQ", owns: ["frontend-web / UserService", "frontend-web / UserProfile"], current: "Working on UserProfile", state: "active" as const, changes: 2, color: "#7dd3fc" },
  { name: "Rahul", role: "Backend Engineer", initials: "RH", owns: ["backend-api / User API", "backend-api / Auth"], current: "Changed User API contract", state: "author" as const, changes: 1, color: "#c4b5fd" },
  { name: "Sara", role: "Mobile Engineer", initials: "SR", owns: ["mobile-app / UserService", "mobile-app / ProfileScreen"], current: "Reviewing downstream patch", state: "review" as const, changes: 1, color: "#6ee7b7" },
  { name: "Mina", role: "Data Engineer", initials: "MN", owns: ["analytics-worker / ETL"], current: "Monitoring pipeline", state: "idle" as const, changes: 0, color: "#fcd34d" },
];

export const REPOS = [
  { name: "frontend-web", stack: "React / TypeScript", owner: "Aqib", status: "patched" as const, note: "Patch generated · tests 18/18", commits: 1240, lang: "TS" },
  { name: "backend-api", stack: "Node / TypeScript", owner: "Rahul", status: "breaking" as const, note: "Contract change detected · #1042", commits: 2318, lang: "TS" },
  { name: "mobile-app", stack: "React Native", owner: "Sara", status: "awaiting" as const, note: "Patch awaiting approval", commits: 986, lang: "TS" },
  { name: "analytics-worker", stack: "Python / dbt", owner: "Mina", status: "healthy" as const, note: "Healthy · last run 4m ago", commits: 412, lang: "PY" },
];

export const CHANGES: SyncChange[] = [
  {
    id: "1042",
    num: 1042,
    title: "User.name → User.full_name",
    from: "User.name",
    to: "User.full_name",
    repo: "backend-api",
    author: "Rahul",
    authorRole: "Backend",
    time: "8 minutes ago",
    sha: "a3f9c21",
    risk: "MEDIUM",
    status: "awaiting-approval",
    breaking: true,
    files: ["src/schemas/user.ts", "src/routes/user.ts", "openapi.yaml"],
    consumers: [
      { repo: "frontend-web", component: "UserService", owner: "Aqib", state: "patched", files: 4 },
      { repo: "mobile-app", component: "UserService", owner: "Sara", state: "awaiting", files: 3 },
      { repo: "analytics-worker", component: "ETL mapper", owner: "Mina", state: "healthy", files: 1 },
    ],
    aiActions: [
      { label: "Frontend patch generated", state: "done" },
      { label: "Regression tests generated", state: "done" },
      { label: "Mobile patch awaiting approval", state: "active" },
    ],
    tests: { passed: 18, total: 18 },
    reason: "Business logic affected. Human approval required.",
    diff: [
      { file: "src/schemas/user.ts", lang: "ts", removed: ["  name: string; // display name"], added: ["  full_name: string; // consolidated identity field"] },
      { file: "src/routes/user.ts", lang: "ts", removed: ['  res.json({ name: user.name })'], added: ['  res.json({ full_name: user.full_name })'] },
    ],
  },
  {
    id: "1041",
    num: 1041,
    title: "Auth.refresh() expiry 24h → 12h",
    from: "expiry: 24h",
    to: "expiry: 12h",
    repo: "backend-api",
    author: "Rahul",
    authorRole: "Backend",
    time: "2 hours ago",
    sha: "77bd410",
    risk: "LOW",
    status: "integrated",
    breaking: false,
    files: ["src/auth/session.ts"],
    consumers: [
      { repo: "frontend-web", component: "AuthClient", owner: "Aqib", state: "patched", files: 2 },
      { repo: "mobile-app", component: "SessionStore", owner: "Sara", state: "patched", files: 2 },
    ],
    aiActions: [
      { label: "Session patch generated", state: "done" },
      { label: "Token refresh tests passed", state: "done" },
    ],
    tests: { passed: 12, total: 12 },
    reason: "Config-only change. Auto-integrated.",
    diff: [
      { file: "src/auth/session.ts", lang: "ts", removed: ["  REFRESH_TTL = 24 * 3600;"], added: ["  REFRESH_TTL = 12 * 3600;"] },
    ],
  },
  {
    id: "1040",
    num: 1040,
    title: "payments.charge() signature v2",
    from: "charge(token)",
    to: "charge(paymentMethodId, idempotencyKey)",
    repo: "backend-api",
    author: "Rahul",
    authorRole: "Backend",
    time: "yesterday",
    sha: "e01c9d2",
    risk: "HIGH",
    status: "blocked",
    breaking: true,
    files: ["src/payments/charge.ts", "openapi.yaml"],
    consumers: [
      { repo: "frontend-web", component: "CheckoutForm", owner: "Aqib", state: "blocked", files: 5 },
      { repo: "mobile-app", component: "Paywall", owner: "Sara", state: "affected", files: 4 },
    ],
    aiActions: [
      { label: "Impact mapped across 2 consumers", state: "done" },
      { label: "Auto-integration blocked by policy", state: "blocked" },
      { label: "Migration draft ready for review", state: "pending" },
    ],
    tests: { passed: 6, total: 9 },
    reason: "Payment path modification. Blocked by high-risk policy.",
    diff: [
      { file: "src/payments/charge.ts", lang: "ts", removed: ["  async charge(token: string)"], added: ["  async charge(paymentMethodId: string, idempotencyKey: string)"] },
    ],
  },
];

export const PIPELINE_STEPS: { id: PipelineStage; label: string; hint: string }[] = [
  { id: "detected", label: "Change detected", hint: "webhook · push" },
  { id: "impact", label: "Impact analysis", hint: "3 consumers" },
  { id: "fix", label: "Downstream fix", hint: "AI patch" },
  { id: "validation", label: "Validation", hint: "tests · types" },
  { id: "risk", label: "Risk decision", hint: "policy gate" },
  { id: "integration", label: "Integration", hint: "merge · deploy" },
];

export const DEMO_SEQUENCE = [
  { t: 400, log: "Change detected on backend-api@a3f9c21 — src/schemas/user.ts", stage: 0 },
  { t: 1400, log: "Parsing response contract… `name: string` removed", stage: 0 },
  { t: 2400, log: "Impact analysis: 3 downstream consumers found", stage: 1 },
  { t: 3400, log: "Owners identified: Aqib (frontend-web), Sara (mobile-app)", stage: 1 },
  { t: 4600, log: "Sync AI generating downstream patch for frontend-web…", stage: 2 },
  { t: 5800, log: "Frontend patch generated · 4 files · UserService migrated", stage: 2 },
  { t: 6800, log: "Regression tests generated · running validation…", stage: 3 },
  { t: 8000, log: "Validation completed · 18/18 tests passed · types clean", stage: 3 },
  { t: 9000, log: "Risk classified: MEDIUM — business logic affected", stage: 4 },
  { t: 10000, log: "Integration ready · awaiting human approval for mobile-app", stage: 5 },
] as const;

export const HIGH_RISK_SEQUENCE = [
  { t: 400, log: "High-risk change detected on backend-api@e01c9d2 — payments.charge()", stage: 0 },
  { t: 1500, log: "Impact analysis: payment path touches CheckoutForm + Paywall", stage: 1 },
  { t: 2700, log: "AI analysis completed · migration draft generated", stage: 2 },
  { t: 3900, log: "Validation running… 6/9 tests passed · 3 failing on idempotency", stage: 3 },
  { t: 5200, log: "Risk classified: HIGH — payment mutation detected", stage: 4 },
  { t: 6400, log: "Automatic integration BLOCKED by policy · human approval required", stage: 5 },
] as const;
