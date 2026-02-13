# GovCMS UIKit Migration Instructions (`@gov.au/*` -> `@truecms/*`)

This file is the canonical, assistant-agnostic workflow for migrating a GovCMS UIKit-based theme.

## Objective

- Upgrade a GovCMS UIKit-based Drupal theme from `@gov.au/*` to `@truecms/*`.
- Keep existing Drupal integration intact (no unnecessary Twig or `libraries.yml` rewrites).
- Produce a successful Node 22 build and clean dependency audit.

## Prerequisites

- Node.js `22.x` is required.
- `npm` `10+` is required.
- `nvm` is optional but recommended for automatic version switching.
- Migration is run from a git working copy with write access.

## Git Safety Gate (Strongly Recommended, Non-Blocking)

Why this matters:

- This migration changes many dependencies and build outputs.
- A clean Git baseline makes rollback and retry predictable if anything fails.

The assistant must run this gate before migration steps:

1. Detect whether `PROJECT_ROOT` is a Git repository:
   - `git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree`
2. If Git is not initialized:
   - Inform user migration can continue, but rollback will be manual and riskier.
   - Ask user whether to initialize a baseline snapshot now.
   - If user says yes, run:
     - `git -C "$PROJECT_ROOT" init`
     - `git -C "$PROJECT_ROOT" add -A`
     - `git -C "$PROJECT_ROOT" commit -m "chore: baseline before truecms migration"`
   - If user says no, continue only after explicit acknowledgement to proceed without Git safety.
3. If Git is initialized, check for uncommitted changes:
   - `git -C "$PROJECT_ROOT" status --porcelain`
4. If working tree is dirty:
   - Ask user to choose one path:
     - stash existing changes (recommended): `git -C "$PROJECT_ROOT" stash push -u -m "pre-truecms-migration"`
     - commit existing changes
     - proceed as-is (allowed, but higher risk)
   - If user chooses stash or commit, assistant must execute that action.
5. Record the chosen path in the migration report before continuing.

## Prerequisite Gate (Assistant Must Complete Before Migration)

The assistant must run this gate and only continue if it passes:

1. Check current runtime:
   - `node -v`
   - `npm -v`
2. If Node is `v22.x` and npm is `10+`, proceed.
3. If Node is not `v22.x` and `nvm` is available:
   - `source ~/.nvm/nvm.sh`
   - `nvm install 22 --latest-npm`
   - `nvm use 22`
   - Re-check `node -v` and `npm -v`.
4. If Node is not `v22.x` and `nvm` is not available:
   - Stop and report a prerequisite failure.
   - Provide guidance to install `nvm` and retry:
     - https://github.com/nvm-sh/nvm#installing-and-updating
5. Do not start migration steps until this gate is green.

## Migration Applicability Gate (Assistant Must Complete Before Migration)

The assistant must confirm this is a legacy GovAU theme before applying this migration:

1. In `THEME_DIR/package.json`, confirm legacy dependencies exist:
   - `rg -n '"@gov\\.au/' "$THEME_DIR/package.json"`
2. Confirm theme source still contains legacy namespace:
   - `rg -n "@gov\\.au/" -S "$THEME_DIR"`
3. Confirm it is not already migrated in dependencies:
   - `rg -n '"@truecms/' "$THEME_DIR/package.json"`
4. Decision rules:
   - If `@gov.au/*` is missing from `package.json`, stop. Migration is not applicable.
   - If `@truecms/*` is already present in `package.json`, stop and report "already migrated or partially migrated" for manual review.
5. Do not start migration steps until this gate is green.

## Required Inputs

- `PROJECT_ROOT`: path to the Drupal repository.
- `THEME_DIR`: path to the custom theme directory, or path relative to `PROJECT_ROOT`.
- `MIGRATION_REPORT`: optional path for the run log file. If not provided, use `"$THEME_DIR/migration-report-truecms.md"`.

## Migration Report (Mandatory, Run-Scoped)

The assistant must maintain a migration report from start to finish.

Rules:

- Start report logging before any migration change is applied.
- On resume/retry, read the existing report first and continue from the last incomplete task.
- Log every gate result, user decision, command executed, output summary, and failure/retry.
- Mark task completion in the atomic checklist as soon as each task is completed.

Recommended report template:

```md
# TrueCMS Migration Report

## Context
- Project root: <PROJECT_ROOT>
- Theme dir: <THEME_DIR>
- Started at: <ISO8601 timestamp>
- Assistant: <agent name/version>

## Decisions Log
| Time | Stage | Decision | Reason | User confirmation |
| --- | --- | --- | --- | --- |
| <time> | Git Safety | Stash dirty working tree | Keep reversible baseline | yes |

## Command Log
| Time | Stage | Command | Result |
| --- | --- | --- | --- |
| <time> | Prerequisite Gate | `node -v` | `v22.3.0` |
| <time> | Prerequisite Gate | `npm -v` | `10.8.2` |

## Outcomes
- Build: <pass/fail + summary>
- Audit: <pass/fail + summary>
- Version matrix validation: <pass/fail + summary>
- Smoke test: <pass/fail + summary>

## Atomic Task Board
- [ ] Stage 0 complete
- [ ] Stage 1 complete
- [ ] Stage 2 complete
- [ ] Stage 3 complete
- [ ] Stage 4 complete
- [ ] Stage 5 complete
- [ ] Stage 6 complete
- [ ] Stage 7 complete
- [ ] Stage 8 complete
- [ ] Final verification complete
```

## Atomic Task Board (Must Be Ticked During Execution)

Use this checklist during execution. Tasks are intentionally atomic to avoid rediscovery on resume.

Execution discipline (mandatory):

- After completing any task, immediately tick that checkbox and log the outcome in `MIGRATION_REPORT` before starting the next task.
- Do not start the next stage while any item in the current stage remains unchecked.
- Before declaring migration complete, verify there are no unchecked items in this task board.

### Stage 0: Initialize Tracking
- [ ] Confirm `PROJECT_ROOT` and `THEME_DIR`.
- [ ] Set `MIGRATION_REPORT` path.
- [ ] Create/open migration report.
- [ ] Log start timestamp and environment context.

### Stage 1: Git Safety Gate
- [ ] Detect whether `PROJECT_ROOT` is a Git repository.
- [ ] If Git is missing, ask user whether to initialize baseline snapshot.
- [ ] If user approved Git init, run `git init`, `git add -A`, and baseline commit.
- [ ] If Git exists, check working tree status.
- [ ] If working tree is dirty, ask user to choose stash/commit/proceed-as-is.
- [ ] Execute user choice for stash/commit when selected.
- [ ] Log Git safety decision and outcome.

### Stage 2: Runtime Prerequisite Gate
- [ ] Check `node -v`.
- [ ] Check `npm -v`.
- [ ] If needed and `nvm` exists, switch/install Node 22 and re-check versions.
- [ ] If needed and `nvm` is missing, stop and provide `nvm` install guidance.
- [ ] Log prerequisite gate outcome.

### Stage 3: Migration Applicability Gate
- [ ] Confirm `@gov.au/*` exists in `package.json`.
- [ ] Confirm source contains `@gov.au/` references.
- [ ] Confirm `@truecms/*` is not already in `package.json`.
- [ ] Stop and log if migration is not applicable.
- [ ] Log applicability gate outcome.

### Stage 4: Baseline Capture
- [ ] Capture pre-migration dependency list.
- [ ] Capture pre-migration script/tooling state.
- [ ] Capture `@gov.au/` scan results.
- [ ] Log baseline capture outputs.

### Stage 5: Dependency Migration
- [ ] Replace each `@gov.au/*` dependency with mapped `@truecms/*`.
- [ ] Align migrated packages with expected major versions from table.
- [ ] Ensure `@truecms/pancake` and `@truecms/pancake-sass` are present.
- [ ] Log dependency migration changes.

### Stage 6: Source and Build Script Updates
- [ ] Replace hard-coded `node_modules/@gov.au/...` import paths.
- [ ] Ensure Sass base imports reference `@truecms/core`.
- [ ] Apply setup/restore script updates only if needed.
- [ ] Log file-level changes.

### Stage 7: Install, Build, and Validate
- [ ] Clean install (`rm -rf node_modules package-lock.json` then `npm install --ignore-scripts`).
- [ ] Run `npm audit`.
- [ ] Run `npm run build`.
- [ ] Run package version validation command against matrix.
- [ ] If needed, run `npm rebuild` or reinstall without `--ignore-scripts`.
- [ ] Log command outputs and outcomes.

### Stage 8: Final Verification
- [ ] Verify no `@gov.au/` references remain.
- [ ] Verify each pre-migration dependency has mapped replacement.
- [ ] Verify matrix version checks pass for all migrated packages.
- [ ] Verify `@truecms/pancake-js >= 2.0.2`.
- [ ] Verify generated assets exist.
- [ ] Verify Drupal smoke test pass.
- [ ] Log final verification outcome.

## Dependency Jump Matrix

Use this as the expected namespace/version jump when replacing packages.

| Legacy package | Replacement package | Expected target |
| --- | --- | --- |
| `@gov.au/accordion` | `@truecms/accordion` | `~8.x` |
| `@gov.au/animate` | `@truecms/animate` | `~2.x` |
| `@gov.au/body` | `@truecms/body` | `~3.x` |
| `@gov.au/breadcrumbs` | `@truecms/breadcrumbs` | `~4.x` |
| `@gov.au/buttons` | `@truecms/buttons` | `~4.x` |
| `@gov.au/callout` | `@truecms/callout` | `~4.x` |
| `@gov.au/card` | `@truecms/card` | `~1.x` |
| `@gov.au/control-input` | `@truecms/control-input` | `~4.x` |
| `@gov.au/core` | `@truecms/core` | `~5.x` |
| `@gov.au/cta-link` | `@truecms/cta-link` | `~3.x` |
| `@gov.au/direction-links` | `@truecms/direction-links` | `~4.x` |
| `@gov.au/footer` | `@truecms/footer` | `~4.x` |
| `@gov.au/form` | `@truecms/form` | `~1.x` |
| `@gov.au/grid-12` | `@truecms/grid-12` | `~3.x` |
| `@gov.au/header` | `@truecms/header` | `~5.x` |
| `@gov.au/headings` | `@truecms/headings` | `~3.x` |
| `@gov.au/inpage-nav` | `@truecms/inpage-nav` | `~4.x` |
| `@gov.au/keyword-list` | `@truecms/keyword-list` | `~4.x` |
| `@gov.au/link-list` | `@truecms/link-list` | `~4.x` |
| `@gov.au/main-nav` | `@truecms/main-nav` | `~2.x` |
| `@gov.au/page-alerts` | `@truecms/page-alerts` | `~3.x` |
| `@gov.au/pancake` | `@truecms/pancake` | `^2.0.1` or newer `2.x` |
| `@gov.au/pancake-react` | `@truecms/pancake-react` | matching theme need (optional) |
| `@gov.au/pancake-sass` | `@truecms/pancake-sass` | compatible `2.x` |
| `@gov.au/progress-indicator` | `@truecms/progress-indicator` | `~4.x` |
| `@gov.au/responsive-media` | `@truecms/responsive-media` | `~3.x` |
| `@gov.au/select` | `@truecms/select` | `~3.x` |
| `@gov.au/side-nav` | `@truecms/side-nav` | `~6.x` |
| `@gov.au/skip-link` | `@truecms/skip-link` | `~3.x` |
| `@gov.au/tags` | `@truecms/tags` | `~5.x` |
| `@gov.au/text-inputs` | `@truecms/text-inputs` | `~3.x` |

Security floor:

- Resolved `@truecms/pancake-js` must be `>=2.0.2`.

## Version Validation Rule

After migration, every migrated package must match the expected target in "Dependency Jump Matrix".

- For `~N.x` rows, resolved major version must be `N`.
- For `@truecms/pancake`, resolved major must be `2` and version must be `>=2.0.1`.
- For `@truecms/pancake-sass`, resolved major must be `2`.
- For `@truecms/pancake-js`, resolved version must be `>=2.0.2`.
- For `@truecms/pancake-react`, validate only if present (optional dependency).

Run this command in `THEME_DIR` to enforce the rule:

```bash
node -e '
const fs = require("fs");
const path = require("path");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const declared = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const expectedMajors = {
  "@truecms/accordion": 8,
  "@truecms/animate": 2,
  "@truecms/body": 3,
  "@truecms/breadcrumbs": 4,
  "@truecms/buttons": 4,
  "@truecms/callout": 4,
  "@truecms/card": 1,
  "@truecms/control-input": 4,
  "@truecms/core": 5,
  "@truecms/cta-link": 3,
  "@truecms/direction-links": 4,
  "@truecms/footer": 4,
  "@truecms/form": 1,
  "@truecms/grid-12": 3,
  "@truecms/header": 5,
  "@truecms/headings": 3,
  "@truecms/inpage-nav": 4,
  "@truecms/keyword-list": 4,
  "@truecms/link-list": 4,
  "@truecms/main-nav": 2,
  "@truecms/page-alerts": 3,
  "@truecms/progress-indicator": 4,
  "@truecms/responsive-media": 3,
  "@truecms/select": 3,
  "@truecms/side-nav": 6,
  "@truecms/skip-link": 3,
  "@truecms/tags": 5,
  "@truecms/text-inputs": 3,
  "@truecms/pancake": 2,
  "@truecms/pancake-sass": 2
};
const failures = [];
const readVersion = (name) => {
  try {
    const p = path.join("node_modules", ...name.split("/"), "package.json");
    return JSON.parse(fs.readFileSync(p, "utf8")).version;
  } catch {
    return null;
  }
};
const semverCmp = (a, b) => {
  const pa = a.split(".").map((x) => parseInt(x, 10) || 0);
  const pb = b.split(".").map((x) => parseInt(x, 10) || 0);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
};
for (const [name, major] of Object.entries(expectedMajors)) {
  if (!declared[name]) continue;
  const installed = readVersion(name);
  if (!installed) {
    failures.push(`${name} is declared but not installed`);
    continue;
  }
  const installedMajor = parseInt(installed.split(".")[0], 10);
  if (installedMajor !== major) {
    failures.push(`${name}@${installed} expected major ${major}.x`);
  }
}
const pancake = declared["@truecms/pancake"] ? readVersion("@truecms/pancake") : null;
if (pancake && semverCmp(pancake, "2.0.1") < 0) {
  failures.push(`@truecms/pancake@${pancake} must be >=2.0.1`);
}
const pancakeJs = readVersion("@truecms/pancake-js");
if (!pancakeJs) {
  failures.push("@truecms/pancake-js is not installed");
} else if (semverCmp(pancakeJs, "2.0.2") < 0) {
  failures.push(`@truecms/pancake-js@${pancakeJs} must be >=2.0.2`);
}
if (declared["@truecms/pancake-react"]) {
  const pancakeReact = readVersion("@truecms/pancake-react");
  if (!pancakeReact) {
    failures.push("@truecms/pancake-react is declared but not installed");
  }
}
if (failures.length) {
  console.error("Version validation failed:\\n" + failures.join("\\n"));
  process.exit(1);
}
console.log("Version validation passed");
'
```

## Workflow

1. Preflight and git safety
   - Run `git -C "$PROJECT_ROOT" status -sb` (if Git is initialized).
   - If on `main`/`master`, create or switch to `feature/d11` (or the user-provided feature branch).
   - Confirm `package.json` exists in `THEME_DIR`.
   - Run the "Prerequisite Gate" above and do not proceed unless it passes.
   - Run the "Migration Applicability Gate" above and do not proceed unless it passes.
   - Run the "Git Safety Gate" above and do not proceed until user decision is captured.

2. Set toolchain
   - Ensure active runtime remains Node `v22.x` and npm `10+`.
   - If shell context changed, rerun:
     - `source ~/.nvm/nvm.sh && nvm use 22` (when `nvm` is available)
   - Verify `node -v` and `npm -v`.

3. Baseline scan
   - Run `rg -n "@gov\\.au/" -S "$THEME_DIR"`.
   - Run `rg -n "node_modules/@gov\\.au" -S "$THEME_DIR"`.
   - Capture current scripts/dependencies from theme `package.json`.
   - Capture legacy dependency list from `package.json` to verify 1:1 replacement after migration.

4. Migrate dependencies
   - Replace each `@gov.au/<component>` dependency with `@truecms/<component>` (same component name).
   - Align each replaced component with the major version listed in "Dependency Jump Matrix".
   - Ensure these packages are present:
     - `@truecms/pancake`
     - `@truecms/pancake-sass`
   - Ensure `@truecms/pancake-js` resolves to `>=2.0.2` (direct or transitive).

5. Update scripts and JS restore flow (if needed)
   - Prefer a safe setup script:
     - `"setup": "npm install --ignore-scripts && (./node_modules/.bin/pancake || true) && npm run restore-uikit"`
   - If the theme expects component files in `assets/uikit/js`, add:
     - `"restore-uikit": "node restore-uikit-js.js"`
     - `restore-uikit-js.js` that copies `@truecms/*/lib/js/module.js` (or `main.js`) to `assets/uikit/js/<component>.js`.
   - Keep existing project-specific scripts unless they directly block installs or builds.

6. Update imports and paths
   - Replace hard-coded `node_modules/@gov.au/...` imports with `node_modules/@truecms/...`.
   - Confirm base Sass imports reference `@truecms/core`.

7. Install, audit, build
   - In `THEME_DIR`, run:
     - `rm -rf node_modules package-lock.json`
     - `npm install --ignore-scripts`
     - `npm ls @truecms/pancake @truecms/pancake-sass @truecms/pancake-js`
     - `npm audit`
     - `npm run build`
   - If Pancake assets are missing after install, run `npm rebuild` or rerun `npm install` without `--ignore-scripts`.

8. Verify migration
   - Complete the Stage 8 atomic task checklist above.
   - Complete the "Final Verification Checklist" below.

## Acceptance Criteria

- Theme source no longer references `@gov.au/*`.
- Build succeeds on Node 22.
- `npm audit` has no unresolved vulnerabilities (or blockers are explicitly documented with package/version).
- Atomic task board is fully completed and marked.
- Final report includes:
  - changed files
  - executed commands
  - audit/build outputs
  - follow-up risks/actions
  - Git safety decision (initialized/stashed/committed/proceeded as-is)
  - all gate outcomes and user decisions
  - task completion state

## Final Verification Checklist

- [ ] Node runtime is `v22.x`.
- [ ] `npm` is `10+`.
- [ ] If initial Node was not `v22.x` and `nvm` existed, assistant switched runtime to Node 22 automatically.
- [ ] If initial Node was not `v22.x` and `nvm` did not exist, assistant stopped with prerequisite guidance and did not run migration.
- [ ] Pre-migration applicability gate passed: `package.json` contained `@gov.au/*` and did not contain `@truecms/*`.
- [ ] Git safety gate completed and decision recorded.
- [ ] If Git was missing, user chose whether to initialize baseline snapshot before migration.
- [ ] If Git working tree was dirty, user chose stash/commit/proceed-as-is and assistant executed chosen action when applicable.
- [ ] All `@gov.au/*` dependencies were replaced with `@truecms/*`.
- [ ] Replaced packages match expected major versions from "Dependency Jump Matrix".
- [ ] `@truecms/pancake` and `@truecms/pancake-sass` are installed.
- [ ] Resolved `@truecms/pancake-js` is `>=2.0.2`.
- [ ] Version validation for every migrated package in the matrix passed (no mismatches).
- [ ] Every pre-migration legacy dependency has its mapped `@truecms/*` replacement.
- [ ] `rg -n "@gov\\.au/" -S "$THEME_DIR"` returns no matches.
- [ ] `npm audit` reports 0 unresolved vulnerabilities.
- [ ] `npm run build` succeeds.
- [ ] Expected built assets are present in `assets/uikit/css` and `assets/uikit/js`.
- [ ] Drupal smoke test confirms core UI components render and behave correctly.
- [ ] No unchecked items remain in the Atomic Task Board.

## Guardrails

- Do not edit minified files directly.
- Do not revert unrelated working tree changes.
- Keep migration changes scoped to theme front-end dependencies, imports, and build scripts.
