#!/usr/bin/env bash
set -euo pipefail

# Prompt for the username
read -rp "Enter your username: " username

if [[ -z "$username" ]]; then
  echo "Error: username cannot be empty." >&2
  exit 1
fi

# Store the username in git config
git config --global skill.username "$username"

echo "Username '$username' saved to git config (skill.username)"
