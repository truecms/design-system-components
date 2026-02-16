# GovCMS UIKit Migration Instructions (`1.x` branch)

This runbook is the canonical assistant-agnostic workflow for migrating GovCMS UIKit themes from legacy `@gov.au/*` packages to the `@truecms/*` package scope used by this repository.

## Objective

- Replace legacy `@gov.au/*` dependencies with `@truecms/*` equivalents.
- Keep theme integration stable while upgrading dependencies and tooling.
- Validate builds and tests on Node 22 before release.

## Required Inputs

- `PROJECT_ROOT`: path to the Drupal repository.
- `THEME_DIR`: primary sub-theme path (absolute or relative to `PROJECT_ROOT`).
- `BASE_THEME_DIR`: optional explicit base theme path; otherwise resolve from `THEME_DIR/.info.yml`.

## Mandatory Gates

1. Git Safety Gate
- Confirm repository and branch are correct.
- Check for uncommitted changes and decide: stash, commit, or proceed as-is.

2. Runtime Gate
- Verify `node -v` is `v22.x`.
- Verify package manager tooling required by the target project is available.

3. Theme Topology Gate
- Resolve base theme and all dependency-owning theme directories.
- Identify which theme directories own `package.json` dependencies.

4. Upgrade Path Detection Gate
- Detect `@gov.au/*` usage in dependency-owning theme `package.json` files.
- Detect mixed-scope or stale `@truecms/*` dependencies.

## Execution Checklist

- [ ] Capture baseline dependencies for each dependency-owning theme.
- [ ] Replace `@gov.au/*` dependencies with matching `@truecms/*` dependencies.
- [ ] Regenerate lockfiles and install dependencies.
- [ ] Update source imports that reference `node_modules/@gov.au/...`.
- [ ] Build packages/themes and run available test/lint checks.
- [ ] Confirm no `@gov.au/` references remain.

## Validation Commands

Run the project-specific install/build/test commands from the consumer project after migration. For this repository's baseline guidance, see:

- https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/1.x/docs/migration.md

## Guardrails

- Do not edit minified files directly.
- Do not revert unrelated working tree changes.
- Keep migration changes scoped to dependency and build updates.
