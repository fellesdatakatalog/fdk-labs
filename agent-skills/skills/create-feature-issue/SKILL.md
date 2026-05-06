---
name: create-feature-issue
description: Creates a GitHub feature issue in Norwegian. Use when the user says 'create feature issue', 'feature request', or 'ny feature'.
model: sonnet
argument-hint: "[additional context (optional)]"
---

# Rules

- Always ask for confirmation before pushing to GitHub

# Din oppgave

**Additional context:** $ARGUMENTS

If "Additional context" above is empty, look at the changes made in the code as before. If context is provided, use it as the primary information source for the issue and ignore code changes unless the context refers to them.

Create a GitHub feature issue using `gh issue create`. Fill out all relevant fields. Keep the text very short. Use the template described below.

# GitHub Issue

kort tittel beskrivelse

## 🚀 Feature-forespørsel

### Feature-beskrivelse

Beskriv kort hva som skal bygges eller endres.

### Hvorfor trenger vi det?

Forklar kort problemet eller verdien dette gir.

### Forslag / løsning (valgfritt)

Beskriv kort en mulig løsning hvis relevant.

### Definisjon av ferdig

Beskriv kort hva som definerer den oppgaven som ferdig.
