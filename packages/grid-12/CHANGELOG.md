@truecms/grid-12 CHANGELOG

## 3.0.1

### Patch Changes

- ba15a33: Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
- Updated dependencies [ba15a33]
  - @truecms/core@5.0.1

## 3.0.0

### Major Changes

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.

### Patch Changes

- Updated dependencies [7f941cd]
  - # @truecms/core@5.0.0

> Part of the [TrueCMS design system components](https://github.com/truecms/design-system-components/) ecosystem.

## Contents

- [Versions](#install)
- [Release History](#release-history)

---

## Versions

- [v3.0.0 - 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.](#v300)
- [v2.1.1 - Layout changes based on the new breakpoints in core](#v211)
- [v2.1.0 - Remove --save-dev flag from readme instructions](#v210)
- [v2.0.9 - Removed uikit references](#v209)
- [v2.0.8 - Update dependencies](#v208)
- [v2.0.7 - Removing web pack dev server, updating dependencies](#v207)
- [v2.0.6 - Fixed build scripts for Windows](#v206)
- [v2.0.5 - Replace node-sass with sass](#v205)
- [v2.0.4 - Change npm run watch browser-sync location](#v204)
- [v2.0.3 - Update dependencies](#v203)
- [v2.0.2 - Change homepage link](#v202)
- [v2.0.1 - Fix dependencies](#v201)
- [v2.0.0 - Change to focus colour and border/muted color mix](#v200)
- [v1.0.0 - Moved to AU namespace](#v100)
- [v0.1.1 - Fixed sass rounding precision](#v011)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v3.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- # @truecms/core@5.0.0

### v2.1.1

- Layout changes based on the new breakpoints in core

### v2.1.0

- Remove --save-dev flag from readme instructions

### v2.0.9

- Removed uikit references

### v2.0.8

- Update dependencies

### v2.0.7

- Removing web pack dev server, updating dependencies

### v2.0.6

- Fixed build scripts for Windows

### v2.0.5

- Replace node-sass with sass

### v2.0.4

- Change npm run watch browser-sync location

### v2.0.3

- Update dependencies

### v2.0.2

- Change homepage link

### v2.0.1

- Fixed dependencies

### v2.0.0

- Bumped core version which changed to focus color and border/muted color mix

### v1.0.0

- Moved to AU namespace

### v0.1.1

- Fixed sass rounding precision

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
