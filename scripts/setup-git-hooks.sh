#!/bin/bash
# Setup script to install the HAM pre-commit hook
# Author: Antigravity Code Assistant

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

if [ -z "$REPO_ROOT" ]; then
    echo "❌ Error: Not in a git repository!"
    exit 1
fi

HOOKS_DIR="$REPO_ROOT/.git/hooks"
TARGET_HOOK="$HOOKS_DIR/pre-commit"
SOURCE_SCRIPT="$REPO_ROOT/scripts/pre-commit-ham-audit.sh"

echo "⚙️  Setting up local Git hooks at $HOOKS_DIR..."

# Make sure scripts are executable
chmod +x "$SOURCE_SCRIPT"

# Setup the pre-commit hook
if [ -f "$TARGET_HOOK" ]; then
    # Check if our audit script is already integrated
    if grep -q "pre-commit-ham-audit" "$TARGET_HOOK"; then
        echo "✅ HAM pre-commit hook is already configured."
    else
        echo "⚠️  An existing pre-commit hook was found at $TARGET_HOOK."
        echo "   Appending HAM audit script call to existing hook..."
        echo -e "\n# Call HAM memory drift audit\n\"$SOURCE_SCRIPT\"" >> "$TARGET_HOOK"
        chmod +x "$TARGET_HOOK"
        echo "✅ Append complete."
    fi
else
    # Create new pre-commit hook calling our script
    echo "#!/bin/bash" > "$TARGET_HOOK"
    echo "\"$SOURCE_SCRIPT\"" >> "$TARGET_HOOK"
    chmod +x "$TARGET_HOOK"
    echo "✅ New HAM pre-commit hook installed successfully."
fi

exit 0
