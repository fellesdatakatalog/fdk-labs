---
name: create-ux-issue
description: Creates a GitHub UX issue in Norwegian. Use when the user says 'create UX issue', 'UX problem', or 'brukeropplevelse'.
model: sonnet
argument-hint: "[additional context (optional)]"
---

# Rules

- Always ask for confirmation before pushing to GitHub

# Din oppgave

**Additional context:** $ARGUMENTS

If "Additional context" above is empty, look at the changes made in the code as before. If context is provided, use it as the primary information source for the issue and ignore code changes unless the context refers to them.

Create a GitHub UX issue using `gh issue create`. Fill out all relevant fields. Keep the text very short. Use the template described below.

# GitHub Issue

kort tittel beskrivelse

## 🪄 UX-rapport

### Nåværende oppførsel

Beskriv kort hvordan brukeropplevelsen er i dag.

### Dette er et problem fordi:

Forklar kort hvorfor dette skaper friksjon, forvirring eller dårlig UX.

### Forventet / ønsket oppførsel

Beskriv kort hvordan det burde fungere for brukeren.
