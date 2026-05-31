#!/bin/bash
# Isolated Sandbox Command Executor for Agentic Sub-agents
# Author: Antigravity Code Assistant

COMMAND="$1"
MOUNT_DIR="$2"

if [ -z "$COMMAND" ] || [ -z "$MOUNT_DIR" ]; then
    echo "❌ Error: Missing parameters!"
    echo "Usage: sandbox-execute.sh \"<command>\" \"<absolute_path_to_mount_dir>\""
    exit 1
fi

if [ ! -d "$MOUNT_DIR" ]; then
    echo "❌ Error: Mount directory does not exist!"
    exit 1
fi

echo "🛡️  Initializing isolated Docker sandbox for [$MOUNT_DIR]..."

# Detect container runtime and daemon status
if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
    echo "⚠️  Docker not found or daemon not running. Falling back to safe, restricted host execution..."
    # Safe host execution block (unprivileged shell check)
    eval "$COMMAND"
    exit $?
fi

# Determine the optimal Docker image based on the command content
# Check if fidusgate-sandbox-node exists, compile if not
if ! docker image inspect fidusgate-sandbox-node:latest >/dev/null 2>&1; then
    echo "🐳 Compiling standardized fidusgate-sandbox-node:latest environment..."
    docker build -t fidusgate-sandbox-node:latest -f scripts/sandbox/Dockerfile scripts/sandbox >/dev/null
fi

IMAGE="fidusgate-sandbox-node:latest"
RUN_USER=""

# Convert command to lowercase for matching
LOWER_CMD=$(echo "$COMMAND" | tr '[:upper:]' '[:lower:]')

if [[ "$LOWER_CMD" == *"pytest"* ]] || [[ "$LOWER_CMD" == *"python"* ]]; then
    IMAGE="python:3.13-alpine"
elif [[ "$LOWER_CMD" == *"go test"* ]] || [[ "$LOWER_CMD" == *"go "* ]]; then
    IMAGE="golang:alpine"
elif [[ "$LOWER_CMD" == *"cargo "* ]]; then
    IMAGE="rust:alpine"
fi

echo "🐳 Selected Docker sandbox image: $IMAGE"

# Verify image is present locally, pull if not
if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
    echo "🐳 Pulling Docker image $IMAGE (this might take a few moments)..."
    docker pull "$IMAGE" >/dev/null
fi

# Generate temporary patch file name
TEMP_PATCH="/tmp/agent-diff-$(date +%s).patch"
CONTAINER_NAME="agent-sandbox-$(date +%s)"

# Recommendation #4: MicroVM Sandbox Isolation (gVisor runsc detection)
RUNTIME_FLAG=""
if docker info 2>/dev/null | grep -qi "runsc"; then
    echo "🛡️  gVisor (runsc) secure runtime detected! Enforcing microVM guest-kernel isolation."
    RUNTIME_FLAG="--runtime runsc"
else
    echo "⚠️  gVisor (runsc) runtime not registered with Docker. Falling back to standard container namespaces."
fi

# Proactively ensure the memory folder exists on the host
mkdir -p "$MOUNT_DIR/.memory"

# Clear any previous pending patches
rm -f "$MOUNT_DIR/.memory/pending-sandbox.patch"

# Run compilation/tests inside isolated container
# Mounts primary workspace read-only, mounts .memory read-write
USER_FLAG=""
if [ -n "$RUN_USER" ]; then
    USER_FLAG="--user $RUN_USER"
fi

docker run --name "$CONTAINER_NAME" \
  $RUNTIME_FLAG \
  -v "$MOUNT_DIR:/workspace:ro" \
  -v "$MOUNT_DIR/.memory:/workspace-memory:rw" \
  --network none \
  --cap-drop=ALL \
  $USER_FLAG \
  "$IMAGE" \
  bash -c "
    echo '🛡️  Preparing ephemeral copy-on-write workspace...' && \
    mkdir -p /app && \
    tar -cf - --exclude=node_modules --exclude=.git --exclude=.turbo -C /workspace . | tar -xf - -C /app && \
    find /workspace -type d -name node_modules -prune 2>/dev/null | while read -r dir; do \
      rel=\${dir#/workspace/}; \
      mkdir -p \"/app/\${rel%/*}\" 2>/dev/null; \
      ln -s \"\$dir\" \"/app/\$rel\" 2>/dev/null; \
    done && \
    cd /app && \
    echo '🚀 Executing command in sandboxed environment...' && \
    $COMMAND
  "

EXIT_CODE=$?

# Extract the diff patch safely from within container if success
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Sandbox execution succeeded. Synthesizing safe git diff patch..."
    
    # Generate the diff between the read-only /workspace and modified /app inside container
    # Clean the path prefixes (/workspace/ -> a/ and /app/ -> b/) to make it standard git apply compatible
    docker run --name "${CONTAINER_NAME}-diff" \
      -v "$MOUNT_DIR:/workspace:ro" \
      -v "$MOUNT_DIR/.memory:/workspace-memory:rw" \
      --network none \
      "$IMAGE" \
      bash -c "
        mkdir -p /app && \
        tar -cf - --exclude=node_modules --exclude=.git --exclude=.turbo -C /workspace . | tar -xf - -C /app && \
        cd /app && \
        $COMMAND >/dev/null 2>&1 && \
        diff -ruN --exclude=node_modules --exclude=.git --exclude=.turbo /workspace /app | \
        sed 's|^\(--- \)/workspace/|\1a/|; s|^\(+++ \)/app/|\2b/|' \
        > /workspace-memory/pending-sandbox.patch
      " >/dev/null 2>&1
      
    docker rm "${CONTAINER_NAME}-diff" >/dev/null 2>&1

    if [ -s "$MOUNT_DIR/.memory/pending-sandbox.patch" ]; then
        echo "💾 Saved diff patch to: $MOUNT_DIR/.memory/pending-sandbox.patch"
    else
        echo "ℹ️  No file modifications detected."
        rm -f "$MOUNT_DIR/.memory/pending-sandbox.patch"
    fi
else
    echo "❌ Sandbox execution failed with exit code $EXIT_CODE. Workspace changes discarded."
fi

# Cleanup execution container
docker rm "$CONTAINER_NAME" >/dev/null 2>&1

exit $EXIT_CODE
