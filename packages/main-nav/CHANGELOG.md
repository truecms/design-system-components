@truecms/main-nav CHANGELOG

## 2.0.1

### Patch Changes

- ba15a33: Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
- Updated dependencies [ba15a33]
  - @truecms/animate@2.0.1
  - @truecms/core@5.0.1
  - @truecms/link-list@4.0.1

## 2.0.0

### Major Changes

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.

### Patch Changes

- Updated dependencies [7f941cd]
  - @truecms/animate@2.0.0
  - @truecms/core@5.0.0
  - # @truecms/link-list@4.0.0

> Part of the [TrueCMS design system components](https://github.com/truecms/design-system-components/) ecosystem.

## Contents

- [Versions](#install)
- [Release History](#release-history)

---

## Versions

- [v2.0.0 - 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.](#v200)
- [v1.0.9 - main nav to be collapsible upto MD breakpoint (Fix based on the new grid breakpoints)](#v109)
- [v1.0.8 - Add aria-expanded to main nav menu button](#v108)
- [v1.0.7 - Remove --save-dev flag from readme instructions](#v107)
- [v1.0.6 - Removed word `navigation` from `aria-label` in `<nav>` element](#v106)
- [v1.0.5 - Removed unused `Fragment` React import](#v105)
- [v1.0.4 - Resolve autoprefixer warning](#v104)
- [v1.0.3 - Fix pancake build path](#v103)
- [v1.0.2 - Updated deprecated `text-decoration-skip` property to `text-decoration-skip-ink`](#v102)
- [v1.0.1 - Removed uikit references](#v101)
- [v1.0.0 - Wrap active item in main-nav in an `<a>` and add `aria-current="page"`](#v100)
- [v0.2.0 - Active items are no longer wrapped in `<a>` for accessibility](#v020)
- [v0.1.4 - Fix passing props to main nav react component](#v014)
- [v0.1.3 - Added an aria-label attribute to the nav element](#v013)
- [v0.1.2 - Add missing aria-controls for overlay react](#v012)
- [v0.1.1 - Fix hover color for dark theme, adding propTypes](#v011)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v2.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- @truecms/animate@2.0.0
- @truecms/core@5.0.0
- # @truecms/link-list@4.0.0

### v1.0.9

- main nav to be collapsible upto MD breakpoint (Fix based on the new grid breakpoints)

### v1.0.8

- Add aria-expanded to main nav menu button

### v1.0.7

- Remove --save-dev flag from readme instructions

### v1.0.6

- Removed word `navigation` from `aria-label` in `<nav>` element

### v1.0.5

- Removed unused `Fragment` React import

### v1.0.4

- Resolve autoprefixer warning

### v1.0.3

- Corrected an issue where certain components were published referencing a `src/` folder rather than `lib/`.

### v1.0.2

- Updated deprecated `text-decoration-skip` property to `text-decoration-skip-ink`

### v1.0.1

- Removed uikit references

### v1.0.0

- Wrap active item in main-nav in an `<a>` and add `aria-current="page"`

### v0.2.0

- Active items are no longer wrapped in `<a>` for accessibility
- Active items are now wrapped in a `<span>`, this allows for child elements to retain similar spacing

### v0.1.4

- Fix passing props to main nav react component

### v0.1.3

- Added an aria-label attribute to the nav element

### v0.1.2

- Add missing aria-controls for overlay react

### v0.1.1

- Dark theme hover colour was not changing
- Added PropTypes for the react component

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
