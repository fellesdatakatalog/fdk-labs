#!/usr/bin/env bash
set -euo pipefail

username="${1:-}"

if [[ -z "$username" ]]; then
  read -rp "Enter your username: " username
fi

if [[ -z "$username" ]]; then
  echo "Error: username cannot be empty." >&2
  exit 1
fi

# Store the username in git config
git config --global skill.username "$username"

echo "Username '$username' saved to git config (skill.username)"
