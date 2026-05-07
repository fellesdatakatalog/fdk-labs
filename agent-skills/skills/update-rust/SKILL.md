---
name: update-rust
description: Updates all dependencies in a Rust project to the newest version using cargo update and cargo upgrade.
model: sonnet
allowed-tools: Read, Bash(cargo *), Bash(cat Cargo.toml), Bash(cat Cargo.lock), Bash(ls *)
---

# Update Rust Dependencies

Update all dependencies in a Rust project to their newest versions. Uses `cargo update` for patch/minor updates within semver constraints, and `cargo upgrade` (from `cargo-edit`) for major version bumps that require changes to `Cargo.toml`.

## Rules

- Always run `cargo check` after updating to catch any breaking changes
- If `cargo upgrade` is not available, install it via `cargo install cargo-edit`
- Report what changed, including any breaking changes caught by `cargo check`
- Do not modify any files other than `Cargo.toml` and `Cargo.lock`

### Step 1: Verify this is a Rust project

Check that `Cargo.toml` exists in the current directory or a parent directory:

```bash
ls Cargo.toml
```

If not found, report that no Rust project was detected and stop.

### Step 2: Show current outdated dependencies

Run `cargo outdated` to get a before-state (install if missing):

```bash
cargo outdated 2>/dev/null || cargo install cargo-outdated && cargo outdated
```

If `cargo outdated` is unavailable, skip this step and continue.

### Step 3: Update Cargo.lock within semver constraints

Run `cargo update` to update all dependencies to the latest compatible versions within the semver constraints declared in `Cargo.toml`:

```bash
cargo update
```

### Step 4: Upgrade Cargo.toml version requirements

Use `cargo upgrade` to bump version requirements in `Cargo.toml` to the latest available versions, including major version bumps:

```bash
cargo upgrade 2>/dev/null || (cargo install cargo-edit && cargo upgrade)
```

### Step 5: Verify the project still builds

Run `cargo check` to catch any compilation errors introduced by the upgrades:

```bash
cargo check
```

If `cargo check` fails, report which packages caused the failure and suggest pinning those packages back to their previous versions.

### Step 6: Report results

Summarize what changed.

## Output Format

```text
## Rust Dependency Update Report

### Updated Dependencies
| Crate | Old Version | New Version | Type |
|-------|-------------|-------------|------|
| serde | 1.0.150 | 1.0.203 | minor |
| tokio | 1.28.0 | 2.0.0 | major |

### Build Status
✓ cargo check passed — no breaking changes

### Next Steps
- Review major version bumps for breaking API changes
- Run your test suite: `cargo test`
- Commit: `Cargo.toml` and `Cargo.lock`
```

If `cargo check` fails, replace the Build Status section with:

```text
### Build Errors
The following upgrades caused compilation failures:
- tokio 2.0.0: <error summary>

Suggested fix: pin back to previous version in Cargo.toml:
tokio = "1.28"
```
