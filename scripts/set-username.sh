#!/usr/bin/env bash
set -euo pipefail

# Resolve the absolute path to the agent-skills directory
SKILLS_DIR="$(cd "$(dirname "$0")/../agent-skills" && pwd)"

# Prompt for the username that will replace $username placeholders
read -rp "Enter your username: " username

if [[ -z "$username" ]]; then
  echo "Error: username cannot be empty." >&2
  exit 1
fi

modified=()

# Find all files under agent-skills/ and replace $username with the provided value
while IFS= read -r -d '' file; do
  if grep -qF '$username' "$file"; then
    sed -i "s/\\\$username/$username/g" "$file"
    modified+=("$file")
  fi
done < <(find "$SKILLS_DIR" -type f -print0)

# Report results
if [[ ${#modified[@]} -eq 0 ]]; then
  echo "No files contained \$username placeholder."
else
  echo "Replaced \$username with '$username' in:"
  for f in "${modified[@]}"; do
    echo "  $f"
  done
fi
