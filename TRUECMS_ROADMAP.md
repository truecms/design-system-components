# TRUECMS Roadmap: design-system-components

Last updated: 2026-02-13

## Current Priority
Highest priority repository. Make this repo release-ready and publishable first.

## Cross-Repo Role
- Producer for `@truecms/*` component outputs.
- Producer for unified package `@truecms/design-system`.
- Blocks progress for `design-system-site` and unified pilot work in `govcms8_uikit_starter`.

## Actionable Execution Queue

### M1. Release-readiness verification
- [ ] Run `pnpm run build:unified`.
- [ ] Run `pnpm run test:design-system`.
- [ ] Run `pnpm run test:unified`.
- [ ] Record command outcomes and failing suites (if any) in this file.

### M2. Stabilize release blockers
- [ ] Fix build/test failures found in M1.
- [ ] Re-run M1 commands until clean.
- [ ] Confirm Drupal and React migration fixture tests are green.

### M3. Publish preparation
- [ ] Ensure package metadata and exports for `@truecms/design-system` are final.
- [ ] Prepare/update changeset entries for release.
- [ ] Run release dry-run workflow/commands.

### M4. Prerelease publication
- [ ] Publish prerelease under `@truecms/design-system`.
- [ ] Capture version/tag and publish details in this file.
- [ ] Notify downstream repos (`design-system-site`, `govcms8_uikit_starter`) via their roadmap files.

### M5. Migration handoff assets
- [ ] Publish/update legacy-to-unified mapping document.
- [ ] Publish/update migration quickstart references used by downstream repos.
- [ ] Mark handoff complete in `../MULTI_REPO_ROADMAP.md`.

## Verification Gates
- [ ] No regression in canonical markup/classes/behavior.
- [ ] Accessibility baseline remains green.
- [ ] Unified package build artifacts are installable by fixture consumers.

## Notes
Use `../MULTI_REPO_ROADMAP.md` for cross-repo blockers and sequencing.
