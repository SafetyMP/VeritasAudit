#!/bin/bash
# Unified Repository Bootstrapper
# Author: Antigravity Code Assistant

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
SCRIPTS_DIR="$REPO_ROOT/scripts"

echo "🚀 Starting unified repository bootstrapping..."

# 1. Verify Git Hooks setup
if [ -f "$SCRIPTS_DIR/setup-git-hooks.sh" ]; then
    echo "⚙️  Configuring local Git hooks..."
    bash "$SCRIPTS_DIR/setup-git-hooks.sh"
else
    echo "❌ Error: setup-git-hooks.sh not found!"
    exit 1
fi

# 2. Check for Mise version manager
if ! command -v mise >/dev/null 2>&1; then
    echo "ℹ️  Mise version manager not found. Installing Mise..."
    curl https://mise.jdx.dev/install.sh | sh
    # Add mise to PATH for the current subshell
    export PATH="$HOME/.local/bin:$HOME/.local/share/mise/bin:$PATH"
    eval "$(mise activate bash)"
fi
echo "✅ Mise version manager is active."

# 3. Check Docker status for the isolated sandbox
if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then
        echo "✅ Docker daemon is active. Isolated sandboxed execution is enabled."
    else
        echo "⚠️  Docker daemon is not running. Sandbox execution will fall back to safe host shell."
    fi
else
    echo "⚠️  Docker is not installed. Sandbox execution will fall back to safe host shell."
fi

# 4. Install dependencies if package.json exists
if [ -f "$REPO_ROOT/package.json" ]; then
    echo "📦 Installing package dependencies..."
    if command -v pnpm >/dev/null 2>&1; then
        pnpm install
    elif command -v npm >/dev/null 2>&1; then
        npm install
    fi
fi

# 5. Run initial Context Drift audit
if [ -f "$SCRIPTS_DIR/ham-drift-watcher.sh" ]; then
    echo "📡 Running initial Context Drift audit..."
    bash "$SCRIPTS_DIR/ham-drift-watcher.sh"
fi

echo "🎉 Bootstrapping complete! Your environment is fully configured, secure, and optimized."
exit 0
