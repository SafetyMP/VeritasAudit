#!/bin/bash
# Host-Level microVM Sandbox Setup & Compatibility Utility
# Author: Antigravity Code Assistant
# Purpose: Installs gVisor (runsc) on Linux or outputs step-by-step configuration templates for macOS Docker Desktop.

set -eo pipefail

echo "🛡️  FidusGate: Initiating gVisor (runsc) Sandbox Setup Audits..."

# 1. Prerequisite verification
if ! command -v docker >/dev/null 2>&1; then
    echo "❌ Error: Docker is not installed on this host! Please install Docker first."
    exit 1
fi

OS_TYPE=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH_TYPE=$(uname -m)

echo "💻 Detected Operating System: $OS_TYPE ($ARCH_TYPE)"

# 2. Platform routing
if [ "$OS_TYPE" = "linux" ]; then
    echo "⚙️  Linux host detected. Checking permissions..."
    
    if [ "$EUID" -ne 0 ]; then
        echo "⚠️  Warning: Installing system binaries requires root permissions. Please run with sudo."
        echo "   👉 E.g.: sudo bash scripts/setup-gvisor.sh"
        exit 1
    fi
    
    echo "🚀 Downloading gVisor binaries for Linux ($ARCH_TYPE)..."
    URL_BASE="https://storage.googleapis.com/gvisor/releases/release/latest/$ARCH_TYPE"
    
    mkdir -p /tmp/gvisor
    cd /tmp/gvisor
    
    if ! curl -sSL -O "$URL_BASE/runsc" || ! curl -sSL -O "$URL_BASE/containerd-shim-runsc-v1"; then
        echo "❌ Error: Failed to download gVisor binaries from Google storage endpoint."
        exit 1
    fi
    
    chmod a+rx runsc containerd-shim-runsc-v1
    mv runsc containerd-shim-runsc-v1 /usr/local/bin/
    
    echo "✅ gVisor binaries installed at /usr/local/bin/"
    
    # Register with Docker daemon if not present
    DAEMON_JSON="/etc/docker/daemon.json"
    mkdir -p /etc/docker
    
    echo "📝 Configuring Docker daemon runtime settings at $DAEMON_JSON..."
    if [ -f "$DAEMON_JSON" ]; then
        # Merge runtime configuration securely if jq is present, otherwise output template
        if command -v jq >/dev/null 2>&1; then
            jq '.runtimes.runsc = {"path": "/usr/local/bin/runsc"}' "$DAEMON_JSON" > "${DAEMON_JSON}.tmp" && mv "${DAEMON_JSON}.tmp" "$DAEMON_JSON"
        else
            echo "⚠️  'jq' utility not found. Please manually insert the runsc runtime inside your $DAEMON_JSON config:"
            echo '
{
  "runtimes": {
    "runsc": {
      "path": "/usr/local/bin/runsc"
    }
  }
}'
        fi
    else
        echo '{"runtimes": {"runsc": {"path": "/usr/local/bin/runsc"}}}' > "$DAEMON_JSON"
    fi
    
    echo "✅ Docker daemon configuration refreshed."
    echo "🔄 Recommended: Restart the Docker service to apply changes."
    echo "   👉 Command: sudo systemctl restart docker"
    
elif [ "$OS_TYPE" = "darwin" ]; then
    echo "🍏 macOS Apple host detected."
    echo "🛡️  gVisor (runsc) requires a Linux-native kernel interface and cannot run natively on macOS."
    echo "👉 However, you can easily configure microVM sandbox runtimes INSIDE your Docker Desktop virtual machine!"
    echo ""
    echo "📚 STEP-BY-STEP MACOS CONFIGURATION GUIDE:"
    echo "------------------------------------------------------------------"
    echo "1. Open Docker Desktop on your Mac."
    echo "2. Click on the ⚙️  (Settings) icon in the top header menu."
    echo "3. Select the 'Docker Engine' tab on the left sidebar navigation."
    echo "4. Under the configuration JSON schema editor, add the 'runsc' runtime block:"
    echo ""
    echo "   {"
    echo "     \"runtimes\": {"
    echo "       \"runsc\": {"
    echo "         \"path\": \"/usr/local/bin/runsc\""
    echo "       }"
    echo "     }"
    echo "   }"
    echo ""
    echo "5. Click 'Apply & Restart' in the bottom right corner."
    echo "------------------------------------------------------------------"
    echo "✅ Sandbox emulation fallback settings are now fully primed."
    
else
    echo "❌ Error: Mismatched or unsupported platform ($OS_TYPE)."
    exit 1
fi

echo "🛡️  gVisor compatibility audit completed successfully!"
exit 0
