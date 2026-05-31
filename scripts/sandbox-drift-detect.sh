#!/bin/bash
WORKSPACE_PATH=$1
cd "$WORKSPACE_PATH" || exit 1

# Porcelian output shows additions (??), modifications ( M), and deletions ( D)
git status --porcelain | grep -v "protect-mcp.config.json" | grep -v "\.memory/" | grep -v "node_modules/" | grep -v "\.turbo/"
