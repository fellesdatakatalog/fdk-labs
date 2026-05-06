---
name: create-bug-issue
description: Creates a GitHub bug issue in Norwegian. Use when the user says 'create bug issue', 'report bug', 'feil', or 'bug rapport'.
model: sonnet
argument-hint: "[additional context (optional)]"
---

# Rules

- Always ask for confirmation before pushing to GitHub

# Din oppgave

**Additional context:** $ARGUMENTS

If "Additional context" above is empty, look at the changes made in the code as before. If context is provided, use it as the primary information source for the issue and ignore code changes unless the context refers to them.

Create a GitHub bug issue using `gh issue create`. Fill out all relevant fields. Keep the text very short. Use the template described below.

## 🐛 Bug-rapport

### Nåværende oppførsel

Beskriv hva som faktisk skjer.

### Forventet oppførsel

Beskriv hva som burde skje.

### Hvordan reprodusere?

1.
2.
3.
