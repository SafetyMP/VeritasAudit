#!/bin/bash
# Pre-commit Git Hook: Scans for HAM Scoped Memory (CLAUDE.md) Drift
# Author: Antigravity Code Assistant

echo "🔍 Running HAM Scoped Memory (CLAUDE.md) Drift Audit..."

# Get staged files
STAGED_FILES=$(git diff --cached --name-only)

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No staged files found. Skipping audit."
    exit 0
fi

STALE_COUNT=0
checked_dirs=()

# Function to check if array contains value
contains_element() {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

for file in $STAGED_FILES; do
    # Skip checking CLAUDE.md files themselves
    if [[ "$file" == *"CLAUDE.md"* || "$file" == *".git"* ]]; then
        continue
    fi
    
    # Get the parent directory of the file
    dir=$(dirname "$file")
    
    # Resolve relative parent paths safely
    while [ "$dir" != "." ] && [ "$dir" != "/" ] && [ -n "$dir" ]; do
        # Check if dir has already been audited in this run
        if contains_element "$dir" "${checked_dirs[@]}"; then
            break
        fi
        
        # Check if a scoped HAM CLAUDE.md file exists in this directory
        if [ -f "$dir/CLAUDE.md" ]; then
            checked_dirs+=("$dir")
            
            # Check if this directory's CLAUDE.md is also staged for commit
            if ! git diff --cached --name-only | grep -q "$dir/CLAUDE.md"; then
                echo -e "\033[1;33m⚠️  HAM MEMORY STALENESS DETECTED in [$dir]\033[0m"
                echo -e "   You staged modifications to: \033[36m$file\033[0m"
                echo -e "   But the corresponding scoped memory cheat sheet \033[32m$dir/CLAUDE.md\033[0m has not been updated."
                echo -e "   👉 \033[1mRecommendation:\033[0m Update the cheat sheet manually or run \033[35m'ham audit'\033[0m to ensure agent prompt safety."
                echo ""
                STALE_COUNT=$((STALE_COUNT + 1))
            fi
            break
        fi
        
        # Traverse up directory tree
        dir=$(dirname "$dir")
    done
done

if [ $STALE_COUNT -eq 0 ]; then
    echo "✅ HAM Scoped Memory Audit passed with zero stale folders."
else
    echo "⚠️  HAM Scoped Memory Audit completed with $STALE_COUNT warnings. (Non-blocking)"
fi

# ==========================================
# 2. SHIFT-LEFT LOCAL PRE-COMMIT TESTING
# ==========================================

echo "🧪 Running pre-commit unit testing gate..."

STAGED_CODE_FILES=""
for file in $STAGED_FILES; do
    if [[ "$file" == *.js || "$file" == *.ts || "$file" == *.py || "$file" == *.go || "$file" == *.rs ]]; then
        STAGED_CODE_FILES="$STAGED_CODE_FILES $file"
    fi
done

if [ -n "$STAGED_CODE_FILES" ]; then
    echo "   Staged code changes detected. Running unit tests inside sandbox..."
    
    # Define package manager testing command
    TEST_CMD=""
    if [ -f "package.json" ]; then
        if command -v pnpm >/dev/null 2>&1; then
            TEST_CMD="pnpm test"
        else
            TEST_CMD="npm test"
        fi
    elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
        TEST_CMD="pytest"
    elif [ -f "go.mod" ]; then
        TEST_CMD="go test ./..."
    elif [ -f "Cargo.toml" ]; then
        TEST_CMD="cargo test"
    fi
    
    if [ -n "$TEST_CMD" ]; then
        # Check if Turborepo is used, which has cross-OS native binary requirements
        if [ -f "turbo.json" ]; then
            echo "   Turborepo monorepo detected. Running tests directly on the host to prevent cross-OS binary mismatches..."
            eval "$TEST_CMD"
            TEST_EXIT=$?
        else
            # Run test command inside isolated sandbox
            bash scripts/sandbox-execute.sh "$TEST_CMD" "$(pwd)"
            TEST_EXIT=$?
        fi
        
        if [ $TEST_EXIT -ne 0 ]; then
            echo -e "\033[1;31m❌ PRE-COMMIT TEST GATE FAILED!\033[0m"
            echo "   Unit tests failed inside the isolated sandbox (Exit: $TEST_EXIT)."
            echo "   Commit blocked. Please resolve test failures before committing."
            exit 1
        fi
        echo "✅ Pre-commit test gate passed successfully."
    else
        echo "ℹ️  No test runner detected. Skipping testing gate."
    fi
else
    echo "ℹ️  No staged code changes. Skipping testing gate."
fi

exit 0
