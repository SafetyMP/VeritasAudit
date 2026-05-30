---
name: greenfield-flex-architect
description: "Architect and scaffold greenfield repositories with a modular flex architecture. Allows dynamic transitioning (flexing) between modular blended monoliths and enterprise monorepos (Turborepo/Nx) depending on project scope."
category: architecture
risk: safe
source: custom-dev
date_added: "2026-05-28"
author: Antigravity Code Assistant
tags: [scaffolding, greenfield, monorepo, polyrepo, turborepo, modularity]
tools: [claude, cursor, gemini]
---

# Greenfield Flex Architect

## Overview

Use this playbook when starting a new ("greenfield") software repository. It implements a **Scope Assessment Framework** to choose the optimal architecture and scaffolds a "Flex Workspace"—a codebase structured as a clean, highly modular blended repository that can be trivially upgraded (flexed) into an enterprise monorepo when scope thresholds are triggered.

---

## 📊 1. Repository Decision Matrix (The Flex Assessment)

Before scaffolding, the agent MUST run the following evaluation to choose the repository model:

| Project Variable | Blended Repo (Modular Monolith) | Monorepo (Turborepo/Nx) |
|---|---|---|
| **Deployable Targets** | 1 Primary App (e.g., single API or SPA) | 2+ Apps (e.g., Web App + Mobile App + Admin portal) |
| **Code Sharing Needs** | Minimal (utility functions only) | Heavy (shared UI design system, shared types, shared DB schemas) |
| **Languages** | Single primary language stack | Mixed stacks (e.g., Next.js frontend + Go/Rust microservices) |
| **Team Size / Ownership** | 1 - 3 developers | 4+ developers / Multi-team divisions |
| **Overhead Tolerance** | Low (prefer zero toolchain complexity) | Moderate (willing to configure lockfiles and workspace caching) |

---

## 🛠️ 2. The Greenfield "Flex" Workspace Structure

To ensure you can scale effortlessly, always scaffold greenfield projects using a **workspace-aware directory layout** that starts minimal but is ready for multi-package operations:

```
my-project/
├── package.json              # Root workspace manifest
├── pnpm-workspace.yaml       # Defines pnpm packages directory
├── tsconfig.json             # Root base TypeScript configurations
├── .gitignore
├── .memory/                  # Agent memory & ADR storage
├── packages/                 # Isolated modules (The Blended Core)
│   ├── core-types/           # Shared interface definitions
│   ├── shared-utils/         # Core utility functions
│   └── database/             # Prisma/prisma schemas and migration files
└── apps/                     # Deployable targets (Flexes here)
    └── main-api/             # Primary backend service / SPA
```

### Root Scaffolding Configurations

#### Root `package.json`
```json
{
  "name": "project-root",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "bootstrap": "pnpm install"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

#### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 🚀 3. The "Scale Escape Hatch" (Flexing from Blended to Monorepo)

When project scope expands (e.g., adding a separate admin portal or a react-native mobile client), use this step-by-step workflow to transition your blended modular workspace into a full Turborepo monorepo:

### Step 1: Create a New App Target
1. Create a new directory under `apps/` (e.g., `apps/admin-dashboard`).
2. Scaffold a minimal `package.json` for the new app.

### Step 2: Establish Workspace Dependencies
1. Reference your shared modular folders directly inside the new app's `package.json`:
   ```json
   "dependencies": {
     "@project/core-types": "workspace:*",
     "@project/shared-utils": "workspace:*"
   }
   ```
2. Run `pnpm install` from the root to establish symlinks instantly.

### Step 3: Install Turborepo Caching
1. Initialize Turborepo at your root:
   ```bash
   pnpm add -Dw turbo
   ```
2. Create a `turbo.json` config to enable local caching and parallel execution:
   ```json
   {
     "$schema": "https://turbo.build/schema.json",
     "tasks": {
       "build": {
         "dependsOn": ["^build"],
         "outputs": [".next/**", "dist/**"]
       },
       "dev": {
         "cache": false,
         "persistent": true
       },
       "test": {
         "dependsOn": ["^build"],
         "outputs": []
       }
     }
   }
   ```

---

## 📋 4. Execution Workflow

When starting a project:
1. **Reconnaissance:** Ask the developer about their 3-month and 12-month project scopes.
2. **Classify:** Determine the starting mode (Blended vs. Monorepo) using the Section 1 Decision Matrix.
3. **Scaffold:** Write the root `package.json`, TypeScript bases, and folder structures.
4. **Document:** Store the decision record in `.memory/decisions.md` (ADR) detailing why this repo mode was chosen and outlining the triggers for the Scale Escape Hatch.

## Related Skills

- `@monorepo-architect` - Transitioning into enterprise Turborepo/Nx.
- `@app-builder` - Building the initial functional app packages.
- `@architecture-decision-records` - Logging the repository boundary decisions.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
