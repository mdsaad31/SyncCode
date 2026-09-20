export type CapabilityStatus = "connected" | "available" | "error";
export type AgentRunStatus = "queued" | "running" | "completed" | "blocked" | "failed";
export type AgentActionStatus = "pending" | "running" | "completed" | "failed";

/**
 * Frontend boundary for the workspace integrations that will be connected later.
 * The UI only consumes these contracts and the mock records below.
 */
export type Capability = {
  id: string;
  name: string;
  status: CapabilityStatus;
  source: string;
  capabilities: string[];
  availableToAgent: boolean;
};

export type AgentAction = {
  id: string;
  label: string;
  status: AgentActionStatus;
  capability?: string;
  timestamp?: string;
};

export type AgentRun = {
  id: string;
  task: string;
  status: AgentRunStatus;
  startedAt: string;
  completedAt?: string;
  duration: string;
  risk?: "LOW" | "MEDIUM" | "HIGH";
  actions: AgentAction[];
};

export type WorkspaceContext = {
  project: string;
  repository: string;
  branch: string;
  user: string;
  ownedComponents: string[];
  dependencies: string[];
  syncState: string;
};

export const WORKSPACE_CONTEXT: WorkspaceContext = {
  project: "ShopX",
  repository: "frontend-web",
  branch: "main",
  user: "Aqib",
  ownedComponents: ["UserService", "Profile", "Checkout"],
  dependencies: ["User API", "Auth API"],
  syncState: "Out of sync",
};

export const CAPABILITIES: Capability[] = [
  { id: "github", name: "GitHub", status: "connected", source: "ShopX organization", capabilities: ["Read repository", "Read pull requests", "Create branch", "Create pull request", "Read issues"], availableToAgent: true },
  { id: "git", name: "Git", status: "connected", source: "Workspace", capabilities: ["Inspect status", "View diff", "Create commit"], availableToAgent: true },
  { id: "typescript", name: "TypeScript", status: "connected", source: "frontend-web", capabilities: ["Diagnostics", "Symbols", "Type navigation"], availableToAgent: true },
  { id: "terminal", name: "Terminal", status: "connected", source: "Workspace", capabilities: ["Run approved commands", "Read output"], availableToAgent: true },
  { id: "test-runner", name: "Test Runner", status: "connected", source: "frontend-web", capabilities: ["Unit tests", "Contract tests", "Report results"], availableToAgent: true },
  { id: "eslint", name: "ESLint", status: "connected", source: "frontend-web", capabilities: ["Lint files", "Report fixes"], availableToAgent: true },
  { id: "docker", name: "Docker", status: "available", source: "Developer environment", capabilities: ["Inspect containers", "Run compose task"], availableToAgent: false },
  { id: "postgres", name: "PostgreSQL", status: "available", source: "Developer environment", capabilities: ["Read schema", "Run approved query"], availableToAgent: false },
  { id: "playwright", name: "Playwright", status: "available", source: "Developer environment", capabilities: ["Run browser tests", "Capture traces"], availableToAgent: false },
  { id: "aws", name: "AWS", status: "available", source: "Developer environment", capabilities: ["Inspect configured resources"], availableToAgent: false },
];

export const AGENT_RUNS: AgentRun[] = [
  {
    id: "RUN-1042", task: "Fix User API consumers", status: "completed", startedAt: "09:42:01", completedAt: "09:42:34", duration: "42s", risk: "LOW",
    actions: [
      { id: "a1", label: "Loaded workspace context", status: "completed", timestamp: "09:42:01" },
      { id: "a2", label: "Inspected User API dependency", status: "completed", capability: "TypeScript", timestamp: "09:42:03" },
      { id: "a3", label: "Found 3 downstream references", status: "completed", capability: "TypeScript", timestamp: "09:42:05" },
      { id: "a4", label: "Identified Aqib as owner", status: "completed", timestamp: "09:42:08" },
      { id: "a5", label: "Generated downstream patch", status: "completed", capability: "Git", timestamp: "09:42:13" },
      { id: "a6", label: "Ran TypeScript diagnostics", status: "completed", capability: "TypeScript", timestamp: "09:42:21" },
      { id: "a7", label: "Tests passed", status: "completed", capability: "Test Runner", timestamp: "09:42:29" },
      { id: "a8", label: "Changes ready", status: "completed", timestamp: "09:42:34" },
    ],
  },
  { id: "RUN-1041", task: "Analyze breaking change", status: "completed", startedAt: "09:21:12", completedAt: "09:21:20", duration: "8s", actions: [{ id: "b1", label: "Mapped auth consumers", status: "completed", timestamp: "09:21:14" }, { id: "b2", label: "Prepared impact report", status: "completed", timestamp: "09:21:20" }] },
  { id: "RUN-1040", task: "Update authentication flow", status: "blocked", startedAt: "Yesterday", duration: "18s", risk: "HIGH", actions: [{ id: "c1", label: "Inspected authentication path", status: "completed", timestamp: "16:04:02" }, { id: "c2", label: "Paused for high-risk approval", status: "failed", timestamp: "16:04:18" }] },
];
