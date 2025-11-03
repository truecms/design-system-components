# Tasks: Modernise Design System Components for Node 22 Support

**Input**: Design documents from `/Users/ivan/websites/sites/govau/design-system-components/specs/001-already-began-task/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are required (per spec and Constitution Principle III). Include Jest unit tests, Pa11y accessibility checks, smoke tests via `scripts/helper.js`, bundle parity checks, and CI audit gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Numbering is sequential; tasks marked [P] can run in parallel.

## Format: `[ID] [P?] [Story] Description`

- [P]: Can run in parallel (different files, no dependencies)
- [Story]: Which user story this task belongs to (e.g., US1, US2, US3)
- Always include exact file paths

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish Node 22 baseline and workspace hygiene.

- [x] T001 [US0] Add Node pin: create `.nvmrc` with `22` at repo root (`/Users/ivan/websites/sites/govau/design-system-components/.nvmrc`).
- [x] T002 [US0] Verify engines across workspace: ensure `"engines": {"node": ">=22.0.0", "npm": ">=10.0.0", "pnpm": ">=9.0.0"}` exist in `package.json` and all `packages/*/package.json` (update if missing).
- [x] T003 [P] [US0] Validate GitHub Actions Node matrix aligns with spec: confirm `22.x` plus `lts/*` in `.github/workflows/install-check.yml` and Node `22.x` in `.github/workflows/npm-release.yml`.
- [x] T004 [US0] Bootstrap deps: run `pnpm run bootstrap` (refreshes `pnpm-lock.yaml`) and commit lockfile changes.

**Checkpoint**: Toolchain pinned; CI matrices confirmed; lockfile refreshed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infra required before any user story.

- [x] T101 [US0] Create Pancake migration script `scripts/migrate-pancake.js` to replace `@gov.au/pancake*` → `@truecms/pancake*` in:
  - `packages/*/package.json` (`dependencies`, `devDependencies`, any `pancake` config blocks)
  - `auds.json` (`pancake-module.plugins` arrays)

- [x] T102 [P] [US0] Update `auds.json`: migrate all `pancake-module.plugins` entries to `@truecms/pancake-*` and preserve paths (file: `/Users/ivan/websites/sites/govau/design-system-components/auds.json`).

- [x] T103 [P] [US0] Migrate package manifests: rewrite `@gov.au/pancake` and `@gov.au/pancake-*` to `@truecms/pancake` and `@truecms/pancake-*` in all `packages/*/package.json` and the root `package.json` if present.

- [x] T104 [US0] Upgrade dependencies: run `pnpm up --latest --recursive` followed by `pnpm install --frozen-lockfile`; commit updated `pnpm-lock.yaml`.

- [x] T105 [US0] Add audit gates in CI: insert a step `pnpm audit --prod --json > audit.json` into `.github/workflows/install-check.yml` and `.github/workflows/npm-release.yml`; upload `audit.json` as an artifact; fail if any vulnerability is reported.

- [x] T106 [P] [US0] Ensure site docs build in CI: add step `pnpm run build:site-dist` to `.github/workflows/install-check.yml` after tests (keeps documentation in lockstep).

- [x] T107 [P] [US0] Node engines guard: add a preflight CI step that logs the active Node version and clearly fails with guidance if `<22` is detected (use `node -v` and an if-check) in both workflows.

- [x] T108 [US0] Document Drupal smoke plan scaffold: create `/Users/ivan/websites/sites/govau/design-system-components/docs/drupal.md` with the verification steps from `quickstart.md` (to be expanded during US1/US2).

**Checkpoint**: Migration tooling, upgrades, audits, and documentation build are in place.

---

## Phase 3: User Story 1 - Maintainer secures the Node 22 baseline (Priority: P1) 🎯 MVP

**Goal**: All packages install, build, and audit cleanly on Node 22 with no regressions.

**Independent Test**: On Node 22, `pnpm install --frozen-lockfile` succeeds, `pnpm audit --production` returns 0 vulnerabilities, and rebuilt bundles match expected fixtures for sample components.

### Tests for User Story 1 (MANDATORY)

- [x] T201 [P] [US1] Add bundle parity test runner `scripts/verify-bundles.js` that diffs built outputs against fixtures; exit non‑zero on diff.
- [x] T202 [P] [US1] Seed fixtures: capture current good outputs for representative packages into `specs/001-already-began-task/fixtures/{accordion,buttons,header}/expected/` (copy from `packages/*/lib/**`).
- [x] T203 [US1] Wire parity tests: append `node scripts/verify-bundles.js` to the root `package.json` `test` script so CI runs it after Jest and Pa11y.

### Implementation for User Story 1

- [x] T204 [US1] Execute Pancake migration: run `node scripts/migrate-pancake.js` and rebuild (`pnpm run build`); resolve any loader/peer conflicts.
- [x] T205 [US1] Validate zero vulnerabilities locally: run `pnpm audit --prod --json > specs/001-already-began-task/logs/audit.json` and confirm 0; commit `logs/audit.json`.
- [x] T206 [US1] Golden parity pass: run `pnpm run test` and ensure bundle parity for the three representative packages; update fixtures only with intentional differences (review required).

**Checkpoint**: US1 independently verifiable; CI gates green; proceed to US2.

---

## Phase 4: User Story 2 - Release engineer verifies CI and publishing flow (Priority: P2)

**Goal**: GitHub Actions validates the full command suite on Node 22 and publishes to npm under `@truecms` on tags.

**Independent Test**: Feature branch → all jobs pass including audit and site build; tagged release → packages published under `@truecms` and artifacts archived.

### Tests for User Story 2 (MANDATORY)

- [x] T301 [US2] Add a dry‑run publish job to `.github/workflows/install-check.yml` (separate job) that runs `pnpm run release -- --dry-run` and uploads `changesets-summary.json` to artifacts.
- [x] T302 [P] [US2] Artifact check: upload packed tarball summary (`dist/tarballs/pack-summary.json`) and release dry‑run summary for audit evidence.

### Implementation for User Story 2

- [x] T303 [US2] Friendly secrets guard: add a step at the start of `.github/workflows/npm-release.yml` to fail with a clear message if `secrets.NPM_TOKEN_TRUECMS` is empty.
- [x] T304 [US2] Enable npm provenance: set `NPM_CONFIG_PROVENANCE=true` env on the publish step in `.github/workflows/npm-release.yml`.
- [x] T305 [US2] Ensure `build:site-dist` runs in release workflow after tests to keep docs in sync.
- [x] T306 [US2] Author a short maintainer guide `/Users/ivan/websites/sites/govau/design-system-components/docs/publishing.md` covering inputs (`npm_scope`, `dist_tag`, `dry_run`), required secrets, and recovery steps.
- [x] T307 [US2] Smoke tag test: exercise signed `v0.0.0-dev` flow via `act` using new release parameter resolver; confirmed dry-run publish path and artifacts succeed under Node 22 with mocked credentials.

**Checkpoint**: US2 independently verifiable; publish path validated.

---

## Phase 5: User Story 3 - Documentation lead communicates the stewardship change (Priority: P3)

**Goal**: Documentation and package guidance clearly state TrueCMS stewardship and `@truecms` namespace with migration steps.

**Independent Test**: All visible references to `@gov.au` ownership replaced or contextualised; migration guide published; changelog calls out stewardship transfer.

### Tests for User Story 3 (MANDATORY)

- [x] T401 [P] [US3] Link check: verify updated links in `README.md`, `CONTRIBUTING.md`, `SUPPORT.md`, and package READMEs resolve.

### Implementation for User Story 3

- [x] T402 [US3] Sweep and replace documentation references: update `@gov.au` → `@truecms` ownership language across `README.md`, `CONTRIBUTING.md`, `FAQ.md`, `SUPPORT.md`, and `packages/*/README.md`.
- [x] T403 [P] [US3] Update installation snippets in `packages/*/README.md` to `npm i @truecms/<name>` and verify examples.
- [x] T404 [US3] Create migration guide `/Users/ivan/websites/sites/govau/design-system-components/docs/migration.md` (moving from `@gov.au/*` to `@truecms/*`, Node 22 requirements, command changes).
- [x] T405 [US3] Fix internal references in `README.md` to current spec folder paths (e.g., link to `specs/001-already-began-task/research.md`).
- [x] T406 [US3] Add a Changeset summarising stewardship transfer and Node 22 requirement (`pnpm changeset`).

**Checkpoint**: US3 independently verifiable; docs reviewed and approved.

---

## Phase N: Polish & Cross-Cutting Concerns

- [x] T501 [P] Consolidate CI logs and artifacts naming (audit, parity, pack summaries) and document in `docs/publishing.md` — artifacts now bundle parity, Pa11y, performance, and audit outputs with updated documentation.
- [x] T502 Code cleanup and removal of dead legacy `@gov.au` codepaths or comments — updated package changelogs/readmes to the `@truecms` namespace and removed stale references.
- [x] T503 [P] Expand Pa11y scenarios for 3–5 additional components; store reports under `specs/001-already-began-task/logs/a11y/` — added configurable reporting in `scripts/a11y.js` and captured 2025-11-03 logs for accordion, main-nav, searchbox, side-nav, page-alerts, and responsive-media.
- [x] T504 [P] Performance smoke: record install/build/test durations; fail on >25% regression vs. baseline; publish as job summary in CI — implemented `scripts/performance-metrics.js`, baseline fixtures, workflow instrumentation, and artifact summaries with threshold enforcement.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): none
- Foundational (Phase 2): depends on Setup — BLOCKS all stories
- User Stories (Phases 3–5): depend on Foundational; then can run in parallel or by priority (P1 → P2 → P3)
- Polish: after desired stories complete

### User Story Dependencies

- US1 (P1): starts after Foundational; independent
- US2 (P2): starts after Foundational; independent of US1 (publishing validated via dry‑run)
- US3 (P3): starts after Foundational; independent of US1/US2

### Within Each User Story

- Tests first; then implementation
- Models/services/endpoints order where applicable
- Each story must be demonstrably complete before moving on

---

## Parallel Example: User Story 1

```bash
# Parallelizable tasks within US1
node scripts/verify-bundles.js                 # T201
cp -r packages/accordion/lib specs/001-already-began-task/fixtures/accordion/expected  # T202
cp -r packages/buttons/lib   specs/001-already-began-task/fixtures/buttons/expected    # T202
cp -r packages/header/lib    specs/001-already-began-task/fixtures/header/expected     # T202
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup (Phase 1)
2. Complete Foundational (Phase 2)
3. Deliver US1 (P1) with audit=0 and parity green
4. Validate CI gates and artifacts; demo

### Incremental Delivery

1. US1 → baseline secured
2. US2 → CI/publishing validated
3. US3 → documentation and migration guidance

---

## Summary & Counts

- Total tasks: 35
- Per story:
  - Setup/Foundational (US0): 12
  - US1 (P1): 6
  - US2 (P2): 7
  - US3 (P3): 6
  - Polish: 4

- Parallel opportunities:
  - Most migration edits (auds.json vs. package manifests) can run in parallel.
  - Fixture seeding for multiple components can run in parallel.
  - CI artifact uploads and documentation sweeps can be parallelized by file path.

- Independent test criteria:
  - US1: Node 22 install/build success, audit=0, bundle parity green.
  - US2: PR workflows pass including audit/site‑dist; tagged release publishes under `@truecms` with artifacts.
  - US3: All docs updated; migration guide present; links valid; stewardship change captured in Changeset.

- Suggested MVP scope: User Story 1 (P1).
