# Drupal 11 Smoke Verification

This guide captures the minimum set of checks required to confirm the design system packages remain compatible with Drupal 11 sites.

## Prerequisites

- Node.js 22 active locally (`nvm use 22`)
- pnpm 9.x installed (`pnpm --version` should report 9.x)
- Access to a Drupal 11 site running locally or in a non-production sandbox
- The Drupal theme or profile already configured to load `@truecms` packages via npm or a packaged tarball

## Verification Steps

1. From this repository, install dependencies and produce fresh builds:
   ```bash
   pnpm install --frozen-lockfile
   pnpm run build
   pnpm run build:site-dist
   ```
2. Publish a local tarball for each package needed by the Drupal theme:
   ```bash
   pnpm run pack:tarballs
   ```
3. In the Drupal codebase, replace any `@gov.au/*` dependencies with their `@truecms/*` equivalents and reinstall packages.
4. Clear Drupal caches (`drush cr`) and rebuild the theme assets.
5. Manually exercise the key components rendered by the Drupal theme (accordion, navigation, page alerts, tables) and confirm:
   - CSS is loading without console errors
   - JavaScript behaviours initialise once without duplicate bindings
   - No 404 requests for `@truecms/pancake-*` assets
6. Capture screenshots or notes of any regressions and attach them to the release checklist for traceability.

## Expected Results

- Drupal renders each component using the updated `@truecms` packages with identical markup and interactions to the previous `@gov.au` version.
- No warnings appear in the browser console related to missing assets or deprecated APIs.
- Accessibility tooling (e.g. Pa11y) reports no new violations for the smoke pages.

## Troubleshooting

- If the Drupal asset build still references `@gov.au` scopes, search the theme for hard-coded scope names and update them to `@truecms`.
- When Drupal cannot resolve the new packages, confirm the `package-lock.json`/`pnpm-lock.yaml` in the Drupal project has been refreshed and committed.
- For JavaScript behaviour conflicts, ensure only one copy of `@truecms/core` is bundled and that it matches the version used by component packages (the install command should dedupe to a single version).
- Contact the platform team at `engineering@truecms.com.au` if production releases uncover incompatibilities not reproducible in the sandbox.
