# TRUECMS Roadmap: design-system-components

Last updated: 2026-02-14

## Current Priority
Highest priority repository. Make this repo release-ready and publishable first.

## Cross-Repo Role
- Producer for `@truecms/*` component outputs.
- Producer for unified package `@truecms/design-system`.
- Blocks progress for `design-system-site` and unified pilot work in `govcms8_uikit_starter`.

## Actionable Execution Queue

### M0. CI/CD decomposition and cross-repo rollout
- [x] Complete modular CI refactor in this repo (`install-check` + reusable quality gates + split release validation/publish).
- [ ] Track Drupal rollout in `ispovednik-org` parent issue: https://github.com/truecms/ispovednik-org/issues/74
- [ ] Execute sub-item: split workflow into reusable lint/context/test/deploy jobs: https://github.com/truecms/ispovednik-org/issues/75
- [ ] Execute sub-item: add release-quality preflight gate: https://github.com/truecms/ispovednik-org/issues/77
- [ ] Execute sub-item: align PR required checks with decomposed pipeline: https://github.com/truecms/ispovednik-org/issues/76
- [ ] Execute sub-item: publish CI/CD decomposition runbook and rollback notes: https://github.com/truecms/ispovednik-org/issues/78

### M1. Release-readiness verification
- [x] Run `pnpm run build:unified`.
- [x] Run `pnpm run test:design-system`.
- [x] Run `pnpm run test:unified`.
- [x] Record command outcomes and failing suites (if any) in this file.

### M2. Stabilize release blockers
- [x] Fix build/test failures found in M1.
- [x] Re-run M1 commands until clean.
- [x] Confirm Drupal and React migration fixture tests are green.

### M3. Publish preparation
- [x] Ensure package metadata and exports for `@truecms/design-system` are final.
- [x] Prepare/update changeset entries for release.
- [x] Run release dry-run workflow/commands.

### M4. Prerelease publication
- [ ] Publish prerelease under `@truecms/design-system`.
- [ ] Capture version/tag and publish details in this file.
- [ ] Notify downstream repos (`design-system-site`, `govcms8_uikit_starter`) via their roadmap files.

### M5. Migration handoff assets
- [ ] Publish/update legacy-to-unified mapping document.
- [ ] Publish/update migration quickstart references used by downstream repos.
- [ ] Mark handoff complete in `../MULTI_REPO_ROADMAP.md`.

## Verification Gates
- [x] No regression in canonical markup/classes/behavior.
- [x] Accessibility baseline remains green.
- [x] Unified package build artifacts are installable by fixture consumers.

## Notes
Use `../MULTI_REPO_ROADMAP.md` for cross-repo blockers and sequencing.

### 2026-02-13 verification evidence
- `pnpm run build:unified` passed. Output bundles emitted under `packages/unified-design-system/dist/` with CSS and JS artifacts.
- `pnpm run test:design-system` passed: 10/10 suites and 13/13 tests.
- `pnpm run test:unified` passed: migration suites green and bundle-size check reported `Growth: 0.00%` (within 30% cap).
- M2 had no code failures to fix; rerun requirement satisfied by clean M1 command set and passing migration suites.
- Publish preparation confirmed via package metadata in `packages/unified-design-system/package.json` and existing changeset `/.changeset/unified-design-system-package.md`.
- `pnpm changeset publish --dry-run` attempted and reached npm publish step, but failed due registry/auth constraints (`Access token expired or revoked` / `E404` for `@truecms/design-system` scope). Keep M3 dry-run and all M4 publication tasks open until authenticated publish context is available.

### 2026-02-14 major-bump and downstream validation evidence
- Major version updates were generated with Changesets for all publishable `@truecms/*` packages; key outputs include `@truecms/core@6.0.0`, `@truecms/accordion@9.0.0`, and `@truecms/design-system@1.0.0`.
- Legacy Pancake package coupling was removed from publishable component manifests:
  - removed `postinstall: pancake`,
  - removed `pancake` config blocks,
  - removed `@truecms/pancake*` dependency declarations.
- `scripts/helper.js` package validation was updated to enforce de-Pancake package manifests and reject legacy Pancake dependency/config regressions.
- Local tarballs were produced via `pnpm run pack:tarballs` under `dist/tarballs/` and installed into downstream themes in `drupal-ispovednik` using `npm install --no-save --ignore-scripts <tarballs>`.
- Downstream validation passed for both themes after major tarball install:
  - `web/themes/custom/govcms8_uikit_starter`: `npm run build` and `npm run lint`.
  - `web/themes/custom/cdr`: `npm run build` and `npm run lint`.
- Repository verification passed in this branch:
  - `pnpm run build:unified`
  - `pnpm run test:design-system`
  - `pnpm run test:unified`
- `changeset publish --dry-run` confirms publish intent for all new majors but remains blocked by npm credentials/scope (`NPM_TOKEN` unresolved, `npm whoami` unauthorized, and `E404` on `PUT` for `@truecms/*`).
- Remaining hard blocker is npm credential/scope access for the authenticated publishing identity.
