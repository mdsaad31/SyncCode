/** Shared frontend contract. Mock services implement this today; an API gateway can implement it later. */
export type Risk = "LOW" | "MEDIUM" | "HIGH";
export type SyncEventType =
  | "CHANGE_DETECTED" | "IMPACT_ANALYSIS_STARTED" | "IMPACT_ANALYSIS_COMPLETED"
  | "OWNERS_IDENTIFIED" | "PATCH_GENERATED" | "VALIDATION_STARTED" | "VALIDATION_COMPLETED"
  | "RISK_DECIDED" | "APPROVAL_REQUIRED" | "APPROVED" | "REJECTED"
  | "INTEGRATION_STARTED" | "INTEGRATION_COMPLETED" | "INTEGRATION_FAILED";

export interface Project { id: string; name: string; }
export interface TeamMember { id: string; name: string; role: string; initials: string; }
export interface Repository { id: string; name: string; branch: string; }
export interface Component { id: string; name: string; repositoryId: string; ownerId: string; }
export interface API { id: string; name: string; repositoryId: string; }
export interface Dependency { id: string; from: string; to: string; }
export interface Ownership { componentId: string; memberId: string; }
export interface Impact { changeId: string; affectedComponentIds: string[]; ownerIds: string[]; }
export interface AIAction { id: string; label: string; status: "pending" | "running" | "completed" | "blocked"; }
export interface ValidationRun { id: string; changeId: string; checks: ValidationCheck[]; }
export interface ValidationCheck { id: string; label: string; status: "pending" | "running" | "passed" | "failed"; }
export interface Approval { id: string; changeId: string; status: "pending" | "approved" | "rejected"; }
export interface Integration { id: string; changeId: string; status: "pending" | "approved" | "rejected" | "integrating" | "integrated" | "failed"; }
export interface Capability { id: string; name: string; status: "connected" | "available" | "error"; capabilities: string[]; }
export interface WorkspaceContext { project: Project; repository: Repository; branch: string; currentFile: string; currentUser: TeamMember; ownedComponents: Component[]; dependencies: Dependency[]; activeChangeIds: string[]; syncState: string; capabilities: Capability[]; }
export interface SyncEvent { id: string; type: SyncEventType; changeId: string; message: string; time: string; }

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type PipelineStage = "detected" | "impact" | "fix" | "validation" | "risk" | "integration";
export interface RepoConsumer { repo: string; component: string; owner: string; state: "patched" | "awaiting" | "healthy" | "affected" | "blocked"; files: number; }
export interface SyncChange { id: string; num: number; title: string; from: string; to: string; repo: string; author: string; authorRole: string; time: string; sha: string; risk: RiskLevel; status: string; breaking: boolean; files: string[]; consumers: RepoConsumer[]; aiActions: { label: string; state: "done" | "active" | "pending" | "blocked" }[]; tests: { passed: number; total: number }; reason: string; diff: { file: string; lang: string; removed: string[]; added: string[] }[]; }
export const PIPELINE_STEPS: { id: PipelineStage; label: string; hint: string }[] = [
  { id: "detected", label: "Change detected", hint: "webhook · push" },
  { id: "impact", label: "Impact analysis", hint: "3 consumers" },
  { id: "fix", label: "Downstream fix", hint: "AI patch" },
  { id: "validation", label: "Validation", hint: "tests · types" },
  { id: "risk", label: "Risk decision", hint: "policy gate" },
  { id: "integration", label: "Integration", hint: "merge · deploy" },
];

export function riskFor(kind: "breaking" | "high-risk" | "generated-types"): Risk {
  return kind === "high-risk" ? "HIGH" : kind === "breaking" ? "MEDIUM" : "LOW";
}
