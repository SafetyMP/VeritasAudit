#!/bin/bash
# Real-Time HAM Scoped Memory (CLAUDE.md) Drift Detector
# Author: Antigravity Code Assistant

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
MEMORY_DIR="$REPO_ROOT/.memory"
STATUS_FILE="$MEMORY_DIR/drift-status.json"

mkdir -p "$MEMORY_DIR"

echo "📡 Starting real-time HAM Memory Drift Audit..."

# Initialize JSON status
echo "{" > "$STATUS_FILE"
echo "  \"last_audit_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> "$STATUS_FILE"
echo "  \"drifted_directories\": [" >> "$STATUS_FILE"

DRIFT_COUNT=0
checked_dirs=()

# Find all CLAUDE.md files in subdirectories
HAM_FILES=$(find "$REPO_ROOT" -name "CLAUDE.md" -not -path "*/.git/*" -not -path "*/node_modules/*")

first_entry=true

for file in $HAM_FILES; do
    dir=$(dirname "$file")
    
    # Skip root CLAUDE.md
    if [ "$dir" = "$REPO_ROOT" ]; then
        continue
    fi
    
    # Get latest commit timestamp for directory (excluding CLAUDE.md itself)
    DIR_LATEST_COMMIT=$(git log -n 1 --format="%at" -- "$dir" 2>/dev/null)
    
    # Get latest commit timestamp for the CLAUDE.md memory sheet
    MEM_LATEST_COMMIT=$(git log -n 1 --format="%at" -- "$file" 2>/dev/null)
    
    if [ -n "$DIR_LATEST_COMMIT" ] && [ -n "$MEM_LATEST_COMMIT" ]; then
        # If directory has commits strictly newer than the memory sheet, it has drifted
        if [ "$DIR_LATEST_COMMIT" -gt "$MEM_LATEST_COMMIT" ]; then
            DRIFT_COUNT=$((DRIFT_COUNT + 1))
            
            # Format JSON list items correctly
            if [ "$first_entry" = true ]; then
                first_entry=false
            else
                echo "," >> "$STATUS_FILE"
            fi
            
            relative_dir=${dir#"$REPO_ROOT/"}
            echo -e "   ⚠️  Drifted: \033[33m$relative_dir\033[0m"
            echo -n "    { \"path\": \"$relative_dir\", \"drift_seconds\": $((DIR_LATEST_COMMIT - MEM_LATEST_COMMIT)) }" >> "$STATUS_FILE"
        fi
    fi
done

echo "" >> "$STATUS_FILE"
echo "  ]," >> "$STATUS_FILE"
echo "  \"drift_count\": $DRIFT_COUNT" >> "$STATUS_FILE"
echo "}" >> "$STATUS_FILE"

# Make sure permissions are correct
chmod +x "$REPO_ROOT/scripts/ham-drift-watcher.sh"

echo "✅ Drift audit complete. Status saved to: .memory/drift-status.json"
exit 0
