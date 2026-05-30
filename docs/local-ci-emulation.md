# Local CI Pipeline Emulation Guide (Trunk-Based Verification)
# Author: Antigravity Code Assistant

This guide explains how to configure and execute GitHub Actions workflows locally inside a Docker sandbox using **`act`**. This enables offline pipeline validation and security auditing (`agentic-actions-auditor`) during local development.

---

## 🚀 1. Install `act` (Local CI Engine)

`act` compiles and runs your repository's `.github/workflows/*.yml` steps locally inside standard Docker images.

### Installation

**macOS (using Homebrew):**
```bash
brew install act
```

**Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo lsh
```

**Windows (using Scoop):**
```powershell
scoop install act
```

---

## 🛠️ 2. Execution Profiles

When first running `act`, you will be prompted to select a default Docker image size. We recommend:
* **Micro Image (`ubuntu-latest` fallback):** `node:20-alpine` (Fastest startup, fits standard JS/Py actions)
* **Medium Image (Default):** `catthedev/node:20` (~500MB, includes basic CLI utilities)
* **Large Image (Full GitHub runner emulation):** `nektos/act-environments-ubuntu:18.04` (~18GB, has virtual environments)

---

## 💻 3. Essential CLI Commands for Agents

For Antigravity or local developers to test pipelines entirely offline:

### A. Dry-Run (Check syntax and execution graph)
```bash
act --dry-run
```
*(Prints a clean map of what jobs and steps will run without launching containers)*

### B. Execute Specific Event Trigger
```bash
act pull_request
```
*(Runs the entire suite triggered by pull_request events)*

### C. Execute Targeted Job
```bash
act -j build
```
*(Executes only the job matching id `build`)*

### D. Simulate GitHub Secrets & Environment Variables
If your workflows require custom environment variables or API keys:
```bash
act --secret-file .secrets --env-file .env
```
Create a `.secrets` file locally (do **NOT** check into Git):
```env
GITHUB_TOKEN=your-model-inference-token
CLAUDE_API_KEY=your-api-key
```

---

## 🛡️ 4. Integrating with `agentic-actions-auditor`

Before committing pipeline changes, you can verify that your workflows are secure and immune to dynamic prompt injection:

1. **Scan local YAML workflows:**
   ```bash
   # Runs static analysis on your local actions
   # (Refer to your @agentic-actions-auditor playbook rules)
   ```
2. **Execute local emulation with `act`:**
   ```bash
   # Executes the local run, validating script integrity
   act -j security-audit
   ```
3. **Verify receipts in the sandbox:**
   ```bash
   npx protect-mcp verify --self-test
   ```

By running these local verification loops, you prevent "push-to-GitHub-to-debug-YAML" patterns, keeping your remote branch history green and secure.
