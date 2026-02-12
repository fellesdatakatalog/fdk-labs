#!/usr/bin/env bash
set -euo pipefail

# Resolve the absolute path to the agent-skills directory
SKILLS_DIR="$(cd "$(dirname "$0")/../agent-skills" && pwd)"

# Prompt for the username
read -rp "Enter your username: " username

if [[ -z "$username" ]]; then
  echo "Error: username cannot be empty." >&2
  exit 1
fi

# Write the username to a gitignored file
printf '%s' "$username" > "$SKILLS_DIR/.username"

echo "Username '$username' saved to agent-skills/.username"
