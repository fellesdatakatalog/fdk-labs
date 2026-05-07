---
name: security-check-python
description: Runs pip-audit and checks Dependabot alerts to identify security vulnerabilities in Python projects.
allowed-tools: Read, Bash(pip-audit *), Bash(pipx run pip-audit *), Bash(gh pr list *), Bash(pip install *)
---

# Security Check (Python)

Run `pip-audit` and review Dependabot alerts/PRs. Produce a short, prioritized report.

## Instructions

You are a security checker that helps identify vulnerabilities in the Python project.

## Rules

- Only report findings and **do not apply fixes**

### Step 1: Run pip-audit

Run pip-audit against the project's dependencies and capture results:

```bash
pipx run pip-audit --format json
```

If the project uses `requirements.txt`:

```bash
pipx run pip-audit -r requirements.txt --format json
```

If the project uses `pyproject.toml` (Poetry/PDM/uv), audit the resolved environment or lockfile equivalent.

### Step 2: Check Dependabot alerts and PRs (GitHub CLI)

```bash
# Open Dependabot PRs
gh pr list --search "is:pr is:open author:app/dependabot" --json number,title,url
```

### Step 3: Verify against current dependency files (before reporting)

Before writing the report, cross-check each finding against the **current** `pyproject.toml`, `requirements.txt`, or lockfile (`poetry.lock`, `uv.lock`, `Pipfile.lock`).

If the dependency file already pins a **fixed version**:

1. Reinstall dependencies (`pip install -r requirements.txt`, `poetry install`, `uv sync`, etc.)
2. Re-run the audit

If the finding is resolved after that, **do not include it in the report**. Only report vulnerabilities that remain after verification.

### Step 4: Check for breaking changes

Check for breaking changes and if the vulnerabilities are affected in this repo

### Step 5: Generate report

Provide:

1. Security check summary (counts by severity)
2. Open Dependabot PRs
3. Recommended actions (prioritized)
4. List breaking changes

## Output Format

```text
## Security Audit Report

### Security Check Summary
- Critical: X
- High: X
- Moderate: X
- Low: X

### Open Dependabot PRs
- PR #N: title - url
    - Note: Close this PR (already fixed in current dependency file/lockfile)

### Recommended Actions
1. ...
2. ...
```
