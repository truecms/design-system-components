# Migrating to the current `@truecms` release line

This guide covers both supported upgrade cases:

- from legacy `@gov.au/*` packages
- from an earlier major of `@truecms/*`

## Why this migration matters

- Active maintenance and fixes are published under `@truecms/*`.
- Current supported runtime is Node 22+.
- Modern downstream build stacks are Vite-based; Pancake package dependencies are deprecated for consumers.

## Supported paths

1. **Path A: `@gov.au/*` -> `@truecms/*`**
   - Replace legacy scope dependencies with matching `@truecms/*` package names.
   - Pin to the current target majors documented in `/Users/localuser/websites/sites/govau/design-system-components/docs/installation/INSTRUCTIONS.md`.

2. **Path B: previous `@truecms/*` major -> current major**
   - Keep package names, bump major versions to current targets.
   - Remove deprecated packages (`@truecms/pancake*`, plus any `@gov.au/pancake*`).

## Verification gates

- `node -v` must be `v22.x`.
- `npm -v` must be `10+`.
- `npm audit` should pass (or blockers documented).
- `npm run build` should pass for build-owning themes.
- No `@gov.au/*` dependencies should remain.
- No deprecated Pancake packages should remain in consumer theme `package.json` files.

## Build-stack direction

For themes that are already on `@truecms/*`, the preferred active build stack is:

- Vite (`vite.config.mjs`)
- explicit entrypoints in `assets/modern/`
- post-build sync step to Drupal asset locations

Use the full runbook in `/Users/localuser/websites/sites/govau/design-system-components/docs/installation/INSTRUCTIONS.md` for step-by-step execution and version validation.

## Support

For migration assistance or regressions, open an issue in this repository.
