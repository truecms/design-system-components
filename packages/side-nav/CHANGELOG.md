@truecms/side-nav CHANGELOG

## 6.0.2

### Patch Changes

- 66289be: Initial @truecms publish: enable GHA fallback and stage a minimal patch bump across all public packages to produce a release plan for a `latest` publication.
- Updated dependencies [66289be]
  - @truecms/accordion@8.0.2
  - @truecms/animate@2.0.2
  - @truecms/core@5.0.2
  - @truecms/link-list@4.0.2

## 6.0.1

### Patch Changes

- ba15a33: Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
- Updated dependencies [ba15a33]
  - @truecms/accordion@8.0.1
  - @truecms/animate@2.0.1
  - @truecms/core@5.0.1
  - @truecms/link-list@4.0.1

## 6.0.0

### Major Changes

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.

### Patch Changes

- Updated dependencies [7f941cd]
  - @truecms/accordion@8.0.0
  - @truecms/animate@2.0.0
  - @truecms/core@5.0.0
  - # @truecms/link-list@4.0.0

> Part of the [TrueCMS design system components](https://github.com/truecms/design-system-components/) ecosystem.

## Contents

- [Versions](#install)
- [Release History](#release-history)

---

## Versions

- [v6.0.0 - 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.](#v600)
- [v5.0.9 - Update core package dependency to use the latest version](#v509)
- [v5.0.8 - Remove --save-dev flag from readme instructions](#v508)
- [v5.0.7 - Removed unused `Fragment` React import](#v507)
- [v5.0.6 - Resolve autoprefixer warning](#v506)
- [v5.0.5 - Corrected an issue where certain components were published referencing a `src/` folder rather than `lib/`](#v505)
- [v5.0.4 - Updated deprecated `text-decoration-skip` property to `text-decoration-skip-ink`](#v504)
- [v5.0.3 - Remove aria-selected from side-nav toggle button](#v503)
- [v5.0.2 - Removed uikit references](#v502)
- [v5.0.1 - Update accordion dependency](#v501)
- [v5.0.0 - Update accordion dependency (use `<button>` instead of `<a>` for title)](#v500)
- [v4.0.1 - Update accordion, add a test with state toggle, update side-nav react test examples](#v401)
- [v4.0.0 - Active items are no longer wrapped in `<a>` for accessibility](#v400)
- [v3.0.0 - Updated accordion, see accordion v6.0.0](#v300)
- [v2.0.6 - Added an aria-label attribute to the aside element](#v206)
- [v2.0.5 - Fix active state children getting active style](#v205)
- [v2.0.4 - Update dependencies](#v204)
- [v2.0.3 - Fixing order of dependencies](#v203)
- [v2.0.2 - Added active state for react, Removing web pack dev server, updating dependencies](#v202)
- [v2.0.1 - Removed incorrect margin from desktop side navigation](#v201)
- [v2.0.0 - Update side-nav to use `<aside>` instead of `<nav>`](#v200)
- [v1.0.0 - Update pancake dependency, release first version](#v100)
- [v0.1.1 - Updating dependency in accordion](#v011)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v6.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- @truecms/accordion@8.0.0
- @truecms/animate@2.0.0
- @truecms/core@5.0.0
- # @truecms/link-list@4.0.0

### v5.0.9

- Update core package dependency to use the latest version

### v5.0.8

- Remove --save-dev flag from readme instructions

### v5.0.7

- Removed unused `Fragment` React import

### v5.0.6

- Resolve autoprefixer warning

### v5.0.5

- Fix pancake build path

### v5.0.4

- Updated deprecated `text-decoration-skip` property to `text-decoration-skip-ink`

### v5.0.3

- Remove aria-selected from side-nav toggle button, as [`role="button"` does not support "aria-selected"](https://www.w3.org/TR/wai-aria-1.1/#button)

### v5.0.2

- Removed uikit references

### v5.0.1

- Update accordion dependency

### v5.0.0

- Update accordion dependency (use `<button>` instead of `<a>` for title)

### v4.0.1

- Update accordion, add a test with state toggle
- Update side-nav react test examples

### v4.0.0

- Active items are no longer wrapped in `<a>` for accessibility
- Active items are now wrapped in a `<span>`, this allows for the child links to retain full width interaction

### v3.0.0

- Updated accordion dependency
- Removed role tab from accordion dependency

### v2.0.6

- Added an aria-label attribute to the aside element

### v2.0.5

- Fix active state children getting active style

### v2.0.4

- Update dependencies

### v2.0.3

- Fixing order of dependencies

### v2.0.2

- Added active state for react
- Removing web pack dev server, updating dependencies

### v2.0.1

- Removed incorrect margin from desktop side navigation

### v2.0.0

- Update side-nav to use `<aside>` instead of `<nav>`

### v1.0.0

- Update pancake dependency, release first version

### v0.1.1

- Updating to use the latest version of accordion

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
