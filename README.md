SyncCode
Code together. Stay in sync.

SyncCode is an AI-powered collaborative development platform that helps software teams understand, fix, and safely propagate the consequences of code changes.

When one developer changes an API, shared type, or component, SyncCode identifies what is affected, who owns it, what needs to change, and whether the change can be safely automated.

The Problem

Modern software teams rarely work on a single codebase.

A typical application might look like:

Frontend
   ↓
API
   ↓
Backend
   ↓
Database
   ↓
Background Services

These components may be maintained by different developers and even live in different repositories.

A small change can therefore create a chain of downstream work:

Backend developer changes API
          ↓
Frontend becomes incompatible
          ↓
Developer discovers the problem
          ↓
Find affected files
          ↓
Contact the responsible teammate
          ↓
Implement a fix
          ↓
Run tests
          ↓
Create PR
          ↓
Review and merge

The difficult part isn't only detecting that something changed.

The real problem is coordinating everything that happens after the change.

The Solution

SyncCode creates a shared understanding of:

People
Teams
Repositories
Components
APIs
Dependencies
Changes
Ownership
Tests
AI actions

When a meaningful code change occurs, SyncCode follows the complete workflow:

Detect
  ↓
Understand
  ↓
Find Impact
  ↓
Identify Owners
  ↓
Generate Fix
  ↓
Validate
  ↓
Evaluate Risk
  ↓
Integrate / Request Approval

Instead of simply reporting:

"This change might break the frontend."

SyncCode aims to say:

"The backend API changed, these frontend components depend on it, Aqib owns them, an AI-generated patch is ready, validation passed, and the change is safe to integrate."

Core Idea
Technical Graph + Human Graph

SyncCode connects two kinds of information.

Technical dependency graph
Repository
    ↓
Component
    ↓
API
    ↓
Service
    ↓
Dependency
    ↓
Test
Human ownership graph
Component
    ↓
Developer
    ↓
Team

SyncCode combines them:

             Code Change
                 │
                 ▼
          Impact Analysis
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
Technical Impact       Human Impact
       │                   │
Affected Code          Responsible Owner
       │                   │
       └─────────┬─────────┘
                 ▼
             AI Agent
                 │
                 ▼
          Downstream Fix
                 │
                 ▼
             Validation
                 │
                 ▼
             Risk Decision
Example

Suppose a backend developer changes:

- User.name
+ User.full_name

The API's response contract has changed.

SyncCode can identify:

backend-api
     │
     ├── frontend-web
     │      ├── UserService.ts
     │      ├── Profile.tsx
     │      └── Profile.test.ts
     │
     └── mobile-app
            └── UserService

Then it identifies the owners:

Frontend → Aqib
Mobile   → Sara

The AI can prepare downstream changes, validation can be executed, and SyncCode determines whether the result can be automatically integrated or requires human approval.

Key Features
Collaborative Development Workspace

Develop directly inside SyncCode with:

file explorer
code editor
editor tabs
Git state
code preview
validation panel
workspace context

The goal is not to replace every existing IDE feature, but to connect coding directly to project and team intelligence.

Sync Context

While working on a file, developers can see:

Current repository
Current branch
Owner
Dependencies
Upstream APIs
Downstream consumers
Recent changes
Synchronization state

This means the developer isn't working with isolated code.

They are working with the context around that code.

Sync Agent

SyncCode includes a built-in AI development agent.

The agent is designed around the current workspace rather than a blank chat window.

It can understand:

Project
Repository
Current file
Git state
Dependencies
Ownership
Recent changes
Available capabilities

The intended experience is:

The agent already knows where you are working and what your project looks like.

Change Capsules

Every significant change can become a Change Capsule containing:

What changed?
What is affected?
Who is affected?
What did AI do?
What validation passed?
What is the risk?
What happens next?

Example:

CHANGE #1042

User.name → User.full_name

Impact
3 repositories
4 components
2 developers

AI Actions
✓ Downstream patch generated
✓ Regression tests generated

Validation
✓ Build
✓ Unit Tests
✓ Contract Tests

Risk
MEDIUM

Decision
Human approval required
Impact Graph

SyncCode visualizes how a change propagates through the system.

Developer
    ↓
Changed Component
    ↓
API
    ↓
Affected Components
    ↓
Responsible Developers

The graph is designed to make both technical impact and human impact understandable at a glance.

AI-Powered Downstream Fixes

SyncCode doesn't stop at impact detection.

The AI can generate downstream changes for affected consumers.

For example:

- return user.name;
+ return user.full_name;

The developer can:

inspect the proposed changes
view the diff
apply the fix
validate the result
Validation

AI-generated changes should be validated rather than blindly trusted.

The intended pipeline is:

Generated Patch
      ↓
Isolated Environment
      ↓
Type Check
      ↓
Unit Tests
      ↓
Contract Tests
      ↓
Build

Validation results become part of the Change Capsule.

Risk-Aware Automation

SyncCode does not treat every change equally.

LOW RISK

Examples:

generated type updates
generated client updates
documentation
test updates
simple compatibility changes

→ Automatic integration can be allowed.

MEDIUM RISK

Examples:

API adaptation
business logic changes
UI logic changes

→ Human approval is required.

HIGH RISK

Examples:

authentication
authorization
database migrations
infrastructure
security-sensitive changes

→ Automatic integration is blocked.

The goal is:

Automate what is safe. Keep humans in control of what is consequential.

Architecture

The intended architecture is event-driven and AWS-native.

                         ┌───────────────┐
                         │   Developer   │
                         └───────┬───────┘
                                 │
                              git push
                                 │
                                 ▼
                          ┌─────────────┐
                          │   GitHub    │
                          └──────┬──────┘
                                 │
                              Webhook
                                 │
                                 ▼
                         ┌──────────────┐
                         │ API Gateway  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │    Lambda    │
                         │    Webhook   │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ EventBridge  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │     SQS      │
                         └──────┬───────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Step Functions  │
                       └────────┬────────┘
                                │
                 ┌──────────────┼──────────────┐
                 ▼              ▼              ▼
              Change        Dependency      Ownership
              Analyzer       Engine          Engine
                 │              │              │
                 └──────────────┼──────────────┘
                                ▼
                         ┌──────────────┐
                         │   Bedrock    │
                         │ AI Services  │
                         └──────┬───────┘
                                │
                                ▼
                         Generated Patch
                                │
                                ▼
                         ┌──────────────┐
                         │ ECS/Fargate  │
                         │ Validation   │
                         └──────┬───────┘
                                │
                                ▼
                           Risk Engine
                           /          \
                          /            \
                    Auto Integrate   Human Approval
                          \            /
                           \          /
                            ▼        ▼
                              GitHub
                                │
                                ▼
                           SyncCode UI
AWS Services
Service	Purpose
Amazon Cognito	Authentication
API Gateway	Application APIs and webhook ingestion
AWS Lambda	API and event processing
EventBridge	Event routing
SQS	Asynchronous processing
Step Functions	Change workflow orchestration
Amazon Bedrock	AI analysis and code generation
DynamoDB	Project, graph, change and workflow state
S3	Patches, reports and artifacts
ECS / Fargate	Isolated validation
Secrets Manager	Credentials and secrets
CloudWatch	Logging and monitoring
IAM	Access control
AWS CDK	Infrastructure as code
Technology Stack
Frontend
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Lucide
Framer Motion
Monaco Editor
Zustand
TanStack Query
Backend
TypeScript
AWS Lambda
API Gateway
EventBridge
SQS
Step Functions
AI
Amazon Bedrock
Data
DynamoDB
S3
Execution
Docker
ECS
AWS Fargate
Source Control
GitHub
GitHub Webhooks
GitHub App
Infrastructure
AWS CDK
Project Structure
SyncCode/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── data/
│   └── types/
│
├── infra/
│   ├── bin/
│   ├── lib/
│   └── lambda/
│
├── public/
│
├── docs/
│
├── components.json
├── package.json
├── tsconfig.json
└── README.md
Getting Started
Prerequisites

Install:

Node.js
npm
Git
AWS CLI
AWS CDK
Docker

You also need:

an AWS account
a GitHub account
a GitHub repository for testing
Clone the repository
git clone <repository-url>

cd SyncCode
Install frontend dependencies
npm install
Run the frontend
npm run dev

Open:

http://localhost:3000
Environment Configuration

Create:

.env.local

Example:

NEXT_PUBLIC_DATA_MODE=mock
NEXT_PUBLIC_API_URL=

For local development, use:

NEXT_PUBLIC_DATA_MODE=mock

For the deployed backend:

NEXT_PUBLIC_DATA_MODE=api
NEXT_PUBLIC_API_URL=<deployed-api-url>

Never commit secrets or credentials.

Infrastructure Setup

Navigate to:

cd infra

Install dependencies:

npm install

Build:

npm run build

Synthesize:

npx cdk synth

Deploy:

npx cdk deploy

The deployed stack provides the AWS resources required for the event-driven change pipeline.

GitHub Webhook

Configure a GitHub webhook pointing to the deployed SyncCode webhook endpoint.

Use:

Content-Type:
application/json

Event:
Push

The webhook is verified using an HMAC signature before processing.

The expected flow is:

GitHub
   ↓
Webhook
   ↓
API Gateway
   ↓
Lambda
   ↓
EventBridge
   ↓
SQS
   ↓
DynamoDB
Development Workflow

The recommended development workflow is:

1. Start SyncCode
2. Open a project
3. Open the Code workspace
4. Edit a file
5. Review workspace context
6. Run validation
7. Review the change
8. Commit changes

For the automated propagation flow:

1. Developer pushes a change
2. GitHub sends the event
3. SyncCode creates a Change
4. Impact is calculated
5. Owners are identified
6. AI analyzes the change
7. AI prepares downstream fixes
8. Changes are validated
9. Risk is evaluated
10. Integration or approval follows
Demo Scenario

The primary SyncCode demonstration uses a breaking API change.

Before
{
  "id": "123",
  "name": "Aqib"
}
Change
- name
+ full_name
SyncCode
Breaking change detected
        ↓
3 consumers found
        ↓
2 owners identified
        ↓
Downstream patch generated
        ↓
Tests executed
        ↓
Risk evaluated
        ↓
Integration / approval

This demonstrates the complete product concept in a short workflow.

Product Architecture Principles
GitHub remains the source of truth

SyncCode does not need to replace GitHub.

It provides intelligence and coordination around the development workflow.

The unit of automation is the consequence of a change

The goal isn't simply:

"AI writes code"

The goal is:

Code change
   ↓
Understand consequences
   ↓
Coordinate affected work
   ↓
Validate
   ↓
Safely integrate
Humans remain in control

Automation should be proportional to risk.

Low risk
→ automate

Medium risk
→ prepare + approve

High risk
→ block automation
Roadmap
Phase 1 — Foundation

SyncCode dashboard

Code workspace

Change Capsules

Impact Graph

Team/ownership UI

Sync Agent UI

Shared frontend state

AWS CDK scaffold

Phase 2 — Real Event Pipeline

GitHub webhook

Webhook validation

EventBridge

SQS

DynamoDB persistence

Changes API

Phase 3 — Intelligence

Semantic change analyzer

Dependency engine

Ownership engine

Change Capsule generation

Cross-repository impact analysis

Phase 4 — AI

Bedrock impact analysis

Downstream patch generation

AI-generated tests

Risk reasoning

Phase 5 — Validation

Docker validation environment

ECS/Fargate execution

Test orchestration

Build verification

Phase 6 — Integration

GitHub App

Branch creation

Automated commits

Pull request creation

Risk-aware integration

Human approval workflow

Phase 7 — Advanced Agent

Workspace-aware agent

Capability registry

Local agent bridge

GitHub capability

Git capability

Terminal/test capabilities

Extension/tool discovery

Security

SyncCode is designed around several security principles:

GitHub webhook signature verification
IAM least privilege
AWS Secrets Manager for credentials
No secrets in source control
No credentials passed into AI prompts
Controlled code execution
Human approval for high-risk operations
Auditable automation events

Do not execute arbitrary untrusted repositories without appropriate isolation and security controls.

Why SyncCode?

Existing developer tools can help teams:

write code
review code
analyze dependencies
test software
manage repositories

SyncCode focuses on what happens after a meaningful change occurs.

Its core idea is:

Connect the technical impact of a change with the people responsible for its consequences, then automate the safe work that follows.

Hackathon Focus

The initial MVP focuses on one specific problem:

Propagating breaking API changes across dependent software and the teams responsible for it.

The primary demonstration is:

Breaking API Change
        ↓
Impact Detection
        ↓
Owner Identification
        ↓
AI Downstream Fix
        ↓
AWS Validation
        ↓
Risk Decision
        ↓
Integration / Approval
Contributing

Contributions are welcome.

Before making changes:

npm install
npm run lint
npm run typecheck
npm run build

Keep frontend components reusable and maintain the shared domain model.

For new integrations, isolate external service logic behind clear interfaces so the core SyncCode UI does not depend directly on provider-specific implementations.

AI Development Tools

SyncCode may be developed with AI-assisted development tools.

AI tools used during development should be documented in the project/hackathon submission where required.

All generated code should be reviewed, tested, and integrated by the project contributors.

License

Add the project's chosen license here.

MIT
Team

SyncCode

Building a collaborative development environment where developers can code together while AI keeps the consequences of their changes synchronized.
