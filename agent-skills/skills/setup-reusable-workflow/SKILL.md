---
name: setup-reusable-workflow
description: Sets up a GitHub Actions workflow that calls a reusable workflow from the central Informasjonsforvaltning/workflows repo — either by migrating an existing local workflow, or by bootstrapping a new one from the codebase. Use when the user says "migrate workflow", "use reusable workflow", "convert this workflow", "set up CI", "add a workflow", or mentions the central workflows repo.
model: sonnet
argument-hint: "[optional: a workflow file to migrate, or 'new' to bootstrap from the codebase]"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(gh api:*), Bash(gh search code:*), Bash(ls *), Bash(git diff:*)
---

# Set Up a Reusable Workflow

Make the current repository use a reusable workflow from the centralized
[`Informasjonsforvaltning/workflows`](https://github.com/Informasjonsforvaltning/workflows) repo
instead of duplicating build/test/deploy logic locally. This skill works in two modes:

- **Migrate** — an existing local workflow is rewritten to *call* a reusable workflow.
- **Bootstrap** — a repo with no (relevant) workflows gets a new caller workflow, chosen by
  analyzing the codebase.

In both modes it also returns **recommendations** — improvements to the caller setup, and any gaps
where the reusable workflow itself should change to fit the repo (see Step 7).

Decide the mode in Step 1. `$ARGUMENTS` may name a specific workflow file to migrate, or say
`new`/`bootstrap` to force codebase-driven setup.

## Rules

- **Never write a workflow file without showing the proposed result first.** Present a plan + the
  full file, then apply only after the user confirms.
- **In migrate mode, preserve the caller's `on:` triggers verbatim** (push, pull_request,
  workflow_dispatch, branch/tag filters, paths). In bootstrap mode, choose sensible triggers and
  state them.
- **Pin the reusable workflow to `@main`** (the convention in the central repo's README), unless
  the user asks for a specific ref.
- **Always fetch the reusable workflow's current `workflow_call` spec** before generating the
  caller — input/secret names change; never rely on memory.
- **Map every `required: true` input and secret.** If a value cannot be inferred, leave a clearly
  marked `# TODO: confirm <name>` placeholder and list it in the report — do not invent secret
  names, cluster names, or environment values.
- One reusable workflow per caller file. If a service needs several (e.g. build-deploy + a
  security scan), propose one file per concern and say so.
- For multi-environment deploys (staging vs prod), produce one caller job per environment, each
  with its own `environment`/`cluster`/autodeploy secret.
- Only touch `.github/workflows/`.
- **Do not run raw `git` for committing, branching, or PRs — invoke the existing skills.** Use
  `/commit-push` to commit & push on the current branch, `/commit-push-branch` to start a new
  branch, and `/create-branch-and-pr` to branch + commit + push + open a PR. This applies to every
  version-branch follow-up PR too. Hand off to those skills rather than reimplementing git here.

### Step 1: Determine the mode

```bash
ls .github/workflows/ 2>/dev/null
```

- If `$ARGUMENTS` names a file → **migrate** that file.
- If `$ARGUMENTS` is `new`/`bootstrap`, or `.github/workflows/` is empty/absent → **bootstrap**.
- Otherwise read every `*.yml`/`*.yaml` there. Files that already
  `uses: Informasjonsforvaltning/workflows/...` are migrated — report and skip them. For the rest,
  **migrate**. If none look like build/test/deploy candidates, fall back to **bootstrap**.

### Step 2: Establish intent

**Migrate mode** — read each target workflow (Glob + Read) and note what it does: build a Docker
image, run tests, coverage, lint, deploy to a cluster, deploy a cloud function, release, security
scan, publish a specification, etc. Capture the values it uses (app/image name, cluster,
environment, dockerfile path, secret references) — these feed the mapping.

**Bootstrap mode** — detect the stack from project files so you can pick the right reusable
workflow:

| Signal in repo                                  | Stack         | Likely reusable workflows                                   |
| ----------------------------------------------- | ------------- | ----------------------------------------------------------- |
| `Cargo.toml`                                    | Rust          | `test-rust.yaml`, `build-deploy.yaml`                       |
| `pom.xml` / `build.gradle`                      | Java/Maven    | `build-deploy-maven.yaml`, `coverage-maven.yaml`            |
| `pyproject.toml` / `noxfile.py` / `poetry.lock` | Python (nox)  | `build-deploy-nox.yaml`, `test-nox.yaml`, `coverage-nox.yaml`, `pip-audit.yaml`, `release-poetry.yaml` |
| `package.json`                                  | Node          | `build-deploy.yaml`, `coverage-node.yaml`, `lint-node-npm.yaml` |
| `go.mod`                                         | Go            | `coverage-go.yaml`, `build-deploy.yaml`                     |
| `Dockerfile`                                     | deployable    | `build.yaml` / `build-push.yaml` / `build-deploy.yaml`      |
| `kustomize/` or `*.kustomization.yaml`           | k8s/kustomize | `kustomize-deploy.yaml`                                      |
| cloud-function entrypoint / `functions/`         | GCP function  | `deploy-cloud-function.yaml`                                 |
| OpenAPI/spec files to publish                    | specification | `specification-*.yaml`, `grafana-dashboard-*.yaml`          |

Use Glob/Read to confirm signals (e.g. read `package.json` for build/test scripts, check for a
`Dockerfile`). Tell the user what you detected before proposing.

### Step 3: List the reusable workflows and match

```bash
gh api repos/Informasjonsforvaltning/workflows/contents/.github/workflows --jq '.[].name'
```

Match the intent (Step 2) to the single best reusable file. The catalog below is a guide —
**confirm against the live list**, since the repo evolves:

| Reusable workflow                  | Use for                                                  |
| ---------------------------------- | -------------------------------------------------------- |
| `build.yaml`                       | Build a Docker image only (no push, no deploy)           |
| `build-push.yaml`                  | Build & push an image (node/generic), no deploy          |
| `build-push-nox.yaml`              | Build & push an image, Python/nox                        |
| `build-deploy.yaml`                | Build, test, push image **and** deploy (node/generic)    |
| `build-deploy-maven.yaml`          | Build, test, push & deploy, Maven/Java                   |
| `build-deploy-nox.yaml`            | Build, test, push & deploy, Python/nox                   |
| `deploy.yaml`                      | Deploy a pre-built image to a GCP cluster                |
| `deploy-cloud-function.yaml`       | Deploy a GCP Cloud Function                              |
| `kustomize-deploy.yaml`            | Deploy via Kustomize                                     |
| `test-nox.yaml` / `test-rust.yaml` | Run tests (Python/nox, Rust)                             |
| `test-pypi.yaml`                   | Test a PyPI publish                                      |
| `coverage-*.yaml`                  | Test coverage (go / maven / node / nox)                  |
| `lint-node-npm.yaml`               | Lint a node/npm project                                  |
| `pip-audit.yaml` / `codeql.yaml`   | Security scanning (Python deps / CodeQL)                 |
| `release-draft.yaml`               | Draft a GitHub release                                   |
| `release-poetry.yaml`              | Release a Poetry package                                 |
| `grafana-dashboard-*.yaml`         | Deploy/preview a Grafana dashboard                       |
| `specification-*.yaml`             | Upload / delete / publish specification files            |

If nothing fits, say so and stop — do not force a match.

### Step 4: Read the chosen reusable workflow's interface

```bash
gh api repos/Informasjonsforvaltning/workflows/contents/.github/workflows/<file> --jq '.content' | base64 -d
```

Read down to `jobs:` — everything you need is in `on.workflow_call.inputs` (required/optional,
types, defaults) and `on.workflow_call.secrets`.

### Step 5: Learn the convention from sibling repos

The reusable workflow's interface tells you what's *possible*; sibling repos in the org tell you
what's *normal*. Find existing callers of the chosen workflow and copy their conventions instead of
inventing your own from the README.

```bash
gh search code --owner Informasjonsforvaltning \
  'Informasjonsforvaltning/workflows/.github/workflows/<file>' \
  --json repository,path -L 10
```

Pick 2–3 hits (prefer the same stack as the target repo — e.g. for `test-rust.yaml`, prefer Rust
repos), and fetch each caller file:

```bash
gh api repos/<owner>/<repo>/contents/<path> --jq '.content' | base64 -d
```

From these exemplars, extract the house style and reuse it:

- **File layout** — is deploy split into `deploy-staging.yaml` + `deploy-prod.yaml`, or one file?
- **Triggers** — what `on:` events the sibling uses (e.g. `pull_request` with
  `types: [ready_for_review, opened, reopened, synchronize]` for staging; tag push for prod).
- **Job graph** — `needs:` ordering, the typical build→deploy split (e.g. `build-push.yaml` then
  `kustomize-deploy.yaml`), and common `if:` guards (`github.event.pull_request.draft == false`,
  `github.actor != 'dependabot[bot]'`).
- **`permissions:`** block, if present.
- **Concrete input values** — `cluster` per environment (e.g. staging → `digdir-fdk-dev`),
  `gh_environment`, and the **exact secret names** used (e.g.
  `DIGDIR_FDK_AUTODEPLOY: ${{ secrets.DIGDIR_FDK_DEV_AUTODEPLOY }}` for staging vs the prod
  equivalent). These are the values you would otherwise have to guess — take them from real usage.

If no sibling callers exist, fall back to the central repo's README example and say so in the
report.

### Step 6: Build the caller workflow

```yaml
name: <kept from original (migrate) or a clear new name (bootstrap)>

on:
  # migrate: original triggers verbatim. bootstrap: sensible defaults, e.g.
  push:
    branches: [main]

jobs:
  build-and-deploy:
    name: Call reusable workflow
    uses: Informasjonsforvaltning/workflows/.github/workflows/<file>@main
    with:
      # required + relevant optional inputs
    secrets:
      # required secrets
```

- **Follow the sibling convention from Step 5** for file layout, triggers, job graph, `if:` guards,
  `permissions`, and concrete values — don't reinvent the shape from the README.
- **Map inputs** from intent: app/image name → `app_name`; target cluster/env → `cluster` /
  `environment`; dockerfile path; etc. Use the standard expressions the README uses —
  `caller_sha: ${{ github.sha }}`, `repo: ${{ github.repository }}`, `actor: ${{ github.actor }}`.
- **Map secrets** by name to the reusable workflow's required secrets, reusing the exact secret
  names siblings use (e.g. `DIGDIR_FDK_DEV_AUTODEPLOY` for staging). Keep
  `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` when `GH_TOKEN` is required.
- For anything you cannot confidently fill *and* no sibling clarifies, insert
  `# TODO: confirm <name>` and record it.
- One caller job/file per environment for multi-env deploys, matching how siblings split staging vs
  prod.

### Step 7: Assess fit and collect recommendations

Migrating isn't always a clean 1:1 swap. Before presenting, compare what the repo *needs* (Step 2),
what the reusable workflow *offers* (Step 4), and what siblings *do* (Step 5), and gather concrete
recommendations in two buckets. These are advisory — surface them, don't silently apply them.

**A. Caller-side improvements** — things to fix in the local setup / proposed caller:

- Steps in the old workflow now made redundant by the reusable one (delete them).
- Outdated or unpinned `uses:` action versions left in the caller.
- Missing concerns siblings include but this repo lacks — e.g. no test/coverage job, no security
  scan (`pip-audit.yaml`/`codeql.yaml`), no `release-draft.yaml`, no prod counterpart to a staging
  deploy.
- Missing `permissions:`, `if:` guards (draft PRs, dependabot), or `needs:` ordering that siblings
  use.
- Repo settings the new workflow assumes: secrets that must exist (list them), GitHub
  environments, or branch protections.
- Triggers that should change (e.g. tag-push for prod releases).
- **Dead workflows that can never trigger on the branch they live in.**
  A branch-scoped event (`push`/`pull_request` with a `branches:` filter) resolves the workflow
  file from the *target* branch, so a workflow filtered to a branch it does **not** live on never
  runs. The common case: a `develop`-targeted workflow (`on: push: branches: [develop]`) sitting in
  a `v1`/`v2`/`v3` branch — it is dead weight there. Flag any workflow whose only triggers are
  branch-filtered `push`/`pull_request` events that exclude the current branch. (Leave alone
  workflows that can still fire from this branch: `workflow_dispatch`, `schedule`, tag-push, or a
  branch filter that includes this branch.)
  **But only recommend *deleting* such a file on a branch that no longer merges `develop` forward**
  — otherwise the next `develop`→branch merge just reintroduces it, creating churn and confusing
  history. See the specification-repo note below for how to tell which branches are safe to clean.

**B. Reusable-workflow gaps** — where the central workflow wouldn't work optimally for this repo:

- The repo does something the reusable workflow has **no input/secret for** (custom build args, a
  non-default Dockerfile path with no `dockerfile` input, an extra build step, a platform/arch
  matrix, a secret it doesn't expose).
- A required input forces a value that doesn't fit this repo.

For each gap, recommend the better path: a **workaround in the caller** if one exists, otherwise a
**concrete change to propose upstream** to `Informasjonsforvaltning/workflows` (e.g. "add an
optional `build_args` input to `build-deploy.yaml`"). **Do not edit the central repo** — only
describe the change so the user can open an issue/PR there.

If migrating leaves the repo strictly worse than its current bespoke workflow on some axis, say so
plainly rather than pushing the migration through.

> **Specification repos (`specification-*` workflows) — propagate across version branches.**
> Specification repos default to the **`develop`** branch, not `main`, and keep several **version
> branches** (e.g. `dcat-ap-no` has `v1.1`, `v2`, `v3`). Each version branch carries its **own copy**
> of the workflow files — often version-named (`adocs-build-v2.yml`,
> `publish-docs-v1.1-to-staging.yml`) — so a fix applied on `develop` does **not** reach them.
>
> **Reason precisely about *when each workflow fires* before claiming anything about runs.** Read
> every workflow's `on:` block and match it against the actual event. In particular:
> - **Merging a PR that updates workflow files does not run those workflows.** A merge only fires a
>   workflow if the resulting event matches its triggers (e.g. a `push` to the base branch with a
>   matching `branches:`/`paths:` filter). Don't warn that "this workflow will trigger after the
>   merge" unless you've confirmed the merge produces a matching event on the branch where that file
>   is active.
> - A workflow gated to another branch (e.g. `branches: [develop]`) will **not** run from a version
>   branch, and vice versa.
> - State, per workflow you touch, *which event on which branch* would actually run it — rather than
>   asserting it will or won't run in the abstract.
>
> When the target is a specification repo:
> 1. Make the change on `develop` first.
> 2. Enumerate the version branches: `gh api 'repos/<owner>/<repo>/branches?per_page=100' --jq '.[].name'`
>    and keep the version-like ones (`v1.1`, `v2`, …); ignore `develop`, `gh-pages`, `html`, etc.
> 3. **Classify each version branch as develop-tracking or frozen** — this decides whether deleting
>    dead files is safe. Compare it to `develop`:
>    `gh api 'repos/<owner>/<repo>/compare/develop...<branch>' --jq '{status,ahead_by,behind_by}'`.
>    - **Develop-tracking** (typically the *newest* version, only slightly behind — e.g. dcat-ap-no
>      `v3` was behind=3): `develop` is still merged forward into it. **Do not delete** dead
>      develop-targeted files here — the next merge re-adds them, producing delete/re-add churn.
>      Fix the live workflows; leave the harmless dead copies for the develop merge to manage.
>    - **Frozen** (older versions, far behind — e.g. `v2` behind=622, `v1.1` behind=1063): no longer
>      receives `develop` merges, so deletions stick. Safe to clean up dead files here.
> 4. For each version branch, recommend a **separate PR targeting that branch** that:
>    - applies the equivalent fix to *that branch's* workflow files — adapt to its filenames and
>      staging/prod variants rather than copying `develop`'s files verbatim; and
>    - **on frozen branches only**, deletes workflows that can never run there (a `develop`-targeted
>      file, or another version's publish workflow copied in — see the "dead workflows" bullet).
>    List the edits and any deletions as concrete follow-up actions in the report (one row per
>    branch), noting each branch's classification.

### Step 8: Show the plan, then apply

Present the report below with the full proposed file. After the user confirms, write it with
Edit/Write and show `git diff -- <file>`.

To commit and ship the change, **hand off to the existing skills — do not run raw `git`**:
`/commit-push` (current branch), `/commit-push-branch` (new branch), or `/create-branch-and-pr`
(branch + PR). Use `/create-branch-and-pr` for each version-branch follow-up PR as well.

## Output Format

```text
## Reusable Workflow Setup — <migrate | bootstrap>

### Target: .github/workflows/<file>
- migrate: existing workflow does <...>
- bootstrap: detected stack = <Rust / Maven / nox / node / ...> from <signal files>
- Matched reusable workflow: `Informasjonsforvaltning/workflows/.github/workflows/<file>@main`
- Why: <one line>
- Modeled on sibling callers: <repo/path>, <repo/path> (or "no siblings found — used README example")

### Input / secret mapping
| Reusable input/secret | Required | Source                   | Value |
| --------------------- | -------- | ------------------------ | ----- |
| app_name              | yes      | repo / image name        | example-app |
| cluster               | yes      | deploy target            | digdir-fdk-dev |
| GH_TOKEN (secret)     | yes      | GitHub token             | ${{ secrets.GITHUB_TOKEN }} |

### Needs confirmation
- <input/secret left as # TODO in the file>

### Recommendations
**Caller-side improvements**
- <e.g. "Drop the manual `docker build` step — `build-deploy.yaml` handles it.">
- <e.g. "Sibling Rust repos also run `test-rust.yaml` on PRs; consider adding a test job.">
- <e.g. "Add repo secret `DIGDIR_FDK_DEV_AUTODEPLOY` (used by the staging deploy).">

**Reusable-workflow gaps**
- <e.g. "This repo builds with `--platform linux/arm64`; `build-deploy.yaml` has no input for
  build platform. Workaround: none. Suggest proposing an optional `platforms` input upstream.">
- <"None — the reusable workflow covers everything this repo needs." if so>

### Version-branch follow-ups (specification repos only)
_Only when the target is a specification repo with version branches. Omit otherwise._
| Branch | Class           | Fix                              | Delete (frozen only)    | Action |
| ------ | --------------- | -------------------------------- | ----------------------- | ------ |
| v3     | develop-tracking | publish-docs-v3-to-production.yml | — (skip; merge re-adds) | Open PR targeting `v3` |
| v2     | frozen          | adocs-build-v2.yml               | adocs-build-develop.yml | Open PR targeting `v2` |
| v1.1   | frozen          | publish-docs-v1.1-to-staging.yml | adocs-build-develop.yml | Open PR targeting `v1.1` |

### Proposed file
```yaml
<full caller workflow>
```

### Next steps
1. Confirm to apply, then review `git diff`.
2. Fill in any `# TODO:` values (cluster, environment, secret names).
3. Commit with `/commit-push` or open a PR with `/create-branch-and-pr`.
```

If no suitable reusable workflow exists, report that explicitly and change nothing.