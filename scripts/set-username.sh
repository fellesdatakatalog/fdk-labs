#!/usr/bin/env bash
# Exit immediately on errors, undefined variables, or pipe failures
set -euo pipefail

# Use the first argument as the username, or leave empty if no argument was given
username="${1:-}"

# If no username was provided as an argument, prompt the user interactively
if [[ -z "$username" ]]; then
  read -rp "Enter your username: " username
fi

# If still empty (user pressed enter without typing anything), show an error and exit
if [[ -z "$username" ]]; then
  echo "Error: username cannot be empty." >&2
  exit 1
fi

# Save the username globally so agent skills can read it with: git config skill.username
git config --global skill.username "$username"

echo "Username '$username' saved to git config (skill.username)"
