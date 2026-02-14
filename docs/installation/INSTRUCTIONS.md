# GovCMS UIKit Upgrade Instructions (`@gov.au/*` or prior `@truecms/*` -> current `@truecms/*` major)

This is the canonical, assistant-agnostic workflow for upgrading GovCMS UIKit-based theme stacks to the current TrueCMS release line and modern build stack.

## Objective

- Support two upgrade entry points:
  - legacy scope migration: `@gov.au/*` -> `@truecms/*`
  - previous TrueCMS major -> current TrueCMS major
- Remove deprecated Pancake build/package dependencies from consumer themes.
- Keep Drupal integration stable (no unnecessary Twig or `libraries.yml` rewrites).
- Produce a successful Node 22 build and clean dependency audit.

## Supported Upgrade Paths

- Path A: legacy GovAU namespace
  - At least one dependency-owning theme declares `@gov.au/*`.
  - Action: migrate scopes to `@truecms/*` and pin to current target majors.

- Path B: prior TrueCMS major
  - No `@gov.au/*` dependencies remain, but one or more `@truecms/*` packages are below the current target major.
  - Action: bump `@truecms/*` to current target majors and remove deprecated packages.

If neither Path A nor Path B applies, stop and report "already on current major".

## Current Target Majors (Release Line)

Source of truth: package manifests in this repository (validated 2026-02-14).

Use these targets in dependency-owning theme `package.json` files:

| Legacy package | TrueCMS package | Target |
| --- | --- | --- |
| `@gov.au/accordion` | `@truecms/accordion` | `^9.0.0` |
| `@gov.au/animate` | `@truecms/animate` | `^3.0.0` |
| `@gov.au/body` | `@truecms/body` | `^4.0.0` |
| `@gov.au/breadcrumbs` | `@truecms/breadcrumbs` | `^5.0.0` |
| `@gov.au/buttons` | `@truecms/buttons` | `^5.0.0` |
| `@gov.au/callout` | `@truecms/callout` | `^5.0.0` |
| `@gov.au/card` | `@truecms/card` | `^2.0.0` |
| `@gov.au/control-input` | `@truecms/control-input` | `^5.0.0` |
| `@gov.au/core` | `@truecms/core` | `^6.0.0` |
| `@gov.au/cta-link` | `@truecms/cta-link` | `^4.0.0` |
| `@gov.au/direction-links` | `@truecms/direction-links` | `^5.0.0` |
| `@gov.au/footer` | `@truecms/footer` | `^5.0.0` |
| `@gov.au/form` | `@truecms/form` | `^2.0.0` |
| `@gov.au/grid-12` | `@truecms/grid-12` | `^4.0.0` |
| `@gov.au/header` | `@truecms/header` | `^6.0.0` |
| `@gov.au/headings` | `@truecms/headings` | `^4.0.0` |
| `@gov.au/inpage-nav` | `@truecms/inpage-nav` | `^5.0.0` |
| `@gov.au/keyword-list` | `@truecms/keyword-list` | `^5.0.0` |
| `@gov.au/link-list` | `@truecms/link-list` | `^5.0.0` |
| `@gov.au/main-nav` | `@truecms/main-nav` | `^3.0.0` |
| `@gov.au/page-alerts` | `@truecms/page-alerts` | `^4.0.0` |
| `@gov.au/progress-indicator` | `@truecms/progress-indicator` | `^5.0.0` |
| `@gov.au/responsive-media` | `@truecms/responsive-media` | `^4.0.0` |
| `@gov.au/searchbox` | `@truecms/searchbox` | `^2.0.0` |
| `@gov.au/select` | `@truecms/select` | `^4.0.0` |
| `@gov.au/side-nav` | `@truecms/side-nav` | `^7.0.0` |
| `@gov.au/skip-link` | `@truecms/skip-link` | `^4.0.0` |
| `@gov.au/table` | `@truecms/table` | `^2.0.0` |
| `@gov.au/tags` | `@truecms/tags` | `^6.0.0` |
| `@gov.au/text-inputs` | `@truecms/text-inputs` | `^4.0.0` |

Unified package target:

- `@truecms/design-system`: `^1.0.0` (optional downstream adoption track)

## Deprecated Packages (Must Be Removed From Consumer Themes)

Do not declare or install these in upgraded themes:

- `@gov.au/pancake`
- `@gov.au/pancake-react`
- `@gov.au/pancake-sass`
- `@truecms/pancake`
- `@truecms/pancake-js`
- `@truecms/pancake-json`
- `@truecms/pancake-react`
- `@truecms/pancake-sass`

## Prerequisites

- Node.js `22.x`
- npm `10+`
- Git working copy with write access
- `nvm` recommended for runtime switching

## Required Inputs

- `PROJECT_ROOT`: path to the Drupal repository
- `THEME_DIR`: primary sub-theme path (absolute or relative to `PROJECT_ROOT`)
- `BASE_THEME_DIR`: optional explicit base theme path; otherwise resolve from `THEME_DIR/.info.yml`
- `THEME_TARGET_DIRS`: derived list (`BASE_THEME_DIR` + `THEME_DIR`)
- `MIGRATION_REPORT`: optional run log path; default `"$THEME_DIR/migration-report-truecms.md"`

## Mandatory Gates

Run these gates in order before changing dependencies.

### 1) Git Safety Gate

1. Confirm repository and branch:
   - `git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree`
   - `git -C "$PROJECT_ROOT" status --porcelain`
2. If dirty, capture user choice and execute it:
   - stash (recommended)
   - commit
   - proceed as-is
3. Record decision in `MIGRATION_REPORT`.

### 2) Runtime Gate

1. Run `node -v` and `npm -v`.
2. If Node is not `v22.x` and `nvm` exists:
   - `source ~/.nvm/nvm.sh && nvm install 22 --latest-npm && nvm use 22`
3. If Node is not `v22.x` and `nvm` is missing: stop and report prerequisite failure.

### 3) Theme Topology Gate

1. Resolve base theme from `THEME_DIR/.info.yml`.
2. Resolve `BASE_THEME_DIR` (custom first, then contrib).
3. Build `THEME_TARGET_DIRS` from resolved base + sub-theme.
4. Identify dependency-owning theme(s): those with `package.json` that declare UIKit/TrueCMS deps.

### 4) Upgrade Path Detection Gate

Run for each dependency-owning theme:

- `rg -n '"@gov\\.au/' "<theme-dir>/package.json"`
- `rg -n '"@truecms/' "<theme-dir>/package.json"`
- `rg -n '"@(gov\\.au|truecms)/pancake' "<theme-dir>/package.json"`

Decision rules:

- Path A if any `@gov.au/*` dependency exists.
- Path B if no `@gov.au/*`, but `@truecms/*` deps exist and are below target major or deprecated Pancake packages are declared.
- Stop if neither path applies.

## Atomic Task Board

### Stage 0: Initialize Tracking
- [ ] Confirm `PROJECT_ROOT`, `THEME_DIR`, `BASE_THEME_DIR`, and `THEME_TARGET_DIRS`.
- [ ] Create/open `MIGRATION_REPORT`.
- [ ] Log start timestamp and environment context.

### Stage 1: Run Gates
- [ ] Git Safety Gate completed.
- [ ] Runtime Gate completed.
- [ ] Theme Topology Gate completed.
- [ ] Upgrade Path Detection Gate completed.
- [ ] Path A or Path B selected and logged.

### Stage 2: Baseline Capture
- [ ] Capture dependency list from each dependency-owning theme.
- [ ] Capture scripts/tooling state from each build-owning theme.
- [ ] Capture namespace scan results across `THEME_TARGET_DIRS`.

### Stage 3: Dependency Upgrade
- [ ] Path A: replace `@gov.au/*` with mapped `@truecms/*`.
- [ ] Path A/Path B: align all relevant `@truecms/*` to current target majors.
- [ ] Remove deprecated Pancake packages from dependencies/devDependencies.
- [ ] Respect dependency ownership (do not add packages to sub-theme if it does not own deps).

### Stage 4: Source and Build Updates
- [ ] Replace hard-coded `node_modules/@gov.au/...` imports with `node_modules/@truecms/...`.
- [ ] Ensure Sass base imports reference `@truecms/core`.
- [ ] Remove Pancake-only setup/build steps from active scripts.
- [ ] For modern build stack migrations, configure Vite build scripts and sync step.

### Stage 5: Install and Validate
- [ ] For each dependency-owning theme: `rm -rf node_modules package-lock.json && npm install`.
- [ ] For each dependency-owning theme: `npm audit`.
- [ ] For each build-owning theme: `npm run build`.
- [ ] Run version validation command (below) in each dependency-owning theme.
- [ ] If lint exists: `npm run lint`.

### Stage 6: Final Verification
- [ ] No `@gov.au/` references remain across `THEME_TARGET_DIRS`.
- [ ] All migrated packages match target majors.
- [ ] No deprecated Pancake packages are declared.
- [ ] Build outputs exist and Drupal smoke checks pass.

## Version Validation Rule

After migration, every declared `@truecms/*` package must match the target major listed above, and no deprecated Pancake packages can remain.

Run in each dependency-owning theme directory:

```bash
node -e '
const fs = require("fs");
const path = require("path");

const expectedMajors = {
  "@truecms/accordion": 9,
  "@truecms/animate": 3,
  "@truecms/body": 4,
  "@truecms/breadcrumbs": 5,
  "@truecms/buttons": 5,
  "@truecms/callout": 5,
  "@truecms/card": 2,
  "@truecms/control-input": 5,
  "@truecms/core": 6,
  "@truecms/cta-link": 4,
  "@truecms/direction-links": 5,
  "@truecms/footer": 5,
  "@truecms/form": 2,
  "@truecms/grid-12": 4,
  "@truecms/header": 6,
  "@truecms/headings": 4,
  "@truecms/inpage-nav": 5,
  "@truecms/keyword-list": 5,
  "@truecms/link-list": 5,
  "@truecms/main-nav": 3,
  "@truecms/page-alerts": 4,
  "@truecms/progress-indicator": 5,
  "@truecms/responsive-media": 4,
  "@truecms/searchbox": 2,
  "@truecms/select": 4,
  "@truecms/side-nav": 7,
  "@truecms/skip-link": 4,
  "@truecms/table": 2,
  "@truecms/tags": 6,
  "@truecms/text-inputs": 4
};

const deprecated = [
  "@gov.au/pancake",
  "@gov.au/pancake-react",
  "@gov.au/pancake-sass",
  "@truecms/pancake",
  "@truecms/pancake-js",
  "@truecms/pancake-json",
  "@truecms/pancake-react",
  "@truecms/pancake-sass"
];

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const declared = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const failures = [];

const readInstalledVersion = (name) => {
  try {
    const p = path.join("node_modules", ...name.split("/"), "package.json");
    return JSON.parse(fs.readFileSync(p, "utf8")).version;
  } catch {
    return null;
  }
};

for (const [name, major] of Object.entries(expectedMajors)) {
  if (!declared[name]) continue;
  const installed = readInstalledVersion(name);
  if (!installed) {
    failures.push(`${name} is declared but not installed`);
    continue;
  }
  const installedMajor = parseInt(installed.split(".")[0], 10);
  if (installedMajor !== major) {
    failures.push(`${name}@${installed} expected major ${major}.x`);
  }
}

for (const dep of deprecated) {
  if (declared[dep]) failures.push(`${dep} must be removed from package.json`);
}

const legacyGov = Object.keys(declared).filter((name) => name.startsWith("@gov.au/"));
for (const dep of legacyGov) {
  failures.push(`${dep} must be replaced with @truecms/* equivalent`);
}

if (failures.length) {
  console.error("Version validation failed:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("Version validation passed");
'
```

## Modern Build-Stack Cutover (Vite)

Use this when the theme is already on `@truecms/*` and you are removing theme-level legacy build tooling.

Core pattern in build-owning theme(s):

1. Replace scripts in `package.json`:
   - `build`: `vite build && node assets/modern/sync-build.mjs`
   - `build:dev`: `vite build --watch --mode development`
   - `lint`: `eslint assets/js assets/modern --max-warnings=0`
2. Remove legacy active build files:
   - `gulpfile.js`
   - `config.json`
3. Add modern build files:
   - `vite.config.mjs`
   - `assets/modern/entry-*.js`
   - `assets/modern/sync-build.mjs`
   - `eslint.config.mjs` (exclude vendored/minified assets)
4. Ensure `.gitignore` includes `build`.

Verification commands:

```bash
npm install
npm audit
npm run build
npm run lint
```

Expected result:

- `npm audit`: 0 vulnerabilities
- `npm run build`: pass
- `npm run lint`: pass
- no active Pancake compilation/deprecation warnings

## Final Verification Checklist

- [ ] Runtime is Node `v22.x` and npm `10+`.
- [ ] Path A or Path B was explicitly detected and logged.
- [ ] All `@gov.au/*` dependencies were removed/replaced.
- [ ] All relevant `@truecms/*` dependencies match current target majors.
- [ ] Deprecated Pancake packages are not declared in `package.json`.
- [ ] Version validation command passed in each dependency-owning theme.
- [ ] `npm audit` reports 0 unresolved vulnerabilities (or blockers are documented).
- [ ] `npm run build` succeeds in each build-owning theme.
- [ ] Drupal smoke test confirms UI components render and behave correctly.

## Acceptance Criteria

- Migration path was correctly selected and completed (Path A or Path B).
- Consumer themes no longer depend on Pancake packages.
- Build and verification gates pass on Node 22.
- Migration report includes decisions, commands, and outcomes.

## Guardrails

- Do not edit minified files directly.
- Do not revert unrelated working tree changes.
- Keep migration changes scoped to dependencies, imports, and build scripts.
