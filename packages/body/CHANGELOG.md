@truecms/body CHANGELOG

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
- [v2.2.1 - Update core package dependency to use the latest version](#v221)
- [v2.2.0 - Changed `background-color` CSS property when printing from `#fff` to `transparent` and removed --save-dev flag](#v220)
- [v2.1.1 - Resolve autoprefixer warning](#v211)
- [v2.1.0 - Remove external link icon, fix pancake build path](#v210)
- [v2.0.14 - Updated deprecated `text-decoration-skip` property to `text-decoration-skip-ink`](#v2014)
- [v2.0.13 - Removed uikit references](#v2013)
- [v2.0.12 - Change code background colours](#v2012)
- [v2.0.11 - Update dependencies](#v2011)
- [v2.0.10 - Removing web pack dev server, updating dependencies](#v2010)
- [v2.0.9 - Made URL for external links visible in print preview](#v209)
- [v2.0.8 - Fixed build scripts for Windows](#v208)
- [v2.0.7 - Replace node-sass with sass](#v207)
- [v2.0.6 - Change npm run watch browser-sync location](#v206)
- [v2.0.5 - Update dependencies](#v205)
- [v2.0.4 - Fix typo in homepage link](#v204)
- [v2.0.3 - Changing homepage link](#v203)
- [v2.0.2 - Tweak selection opacity for images, video and iframes](#v202)
- [v2.0.1 - Fix dependencies ](#v201)
- [v2.0.0 - Change to focus colour and border/muted color mix](#v200)
- [v1.0.0 - Moved to AU namespace, added new color themes and spacing](#v100)
- [v0.1.2 - Moved to System fonts](#v012)
- [v0.1.1 - Fixed a11y contrast issue](#v011)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v3.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- # @truecms/core@5.0.0

### v2.2.1

- Update core package dependency to use the latest version

### v2.2.0

- Switched `background-color` CSS property when printing from `#fff` to `transparent`
- Remove --save-dev flag from readme instructions

### v2.1.1

- Resolve autoprefixer warning

### v2.1.0

- Remove external link icon
- Corrected an issue where certain components were published referencing a `src/` folder rather than `lib/`.

### v2.0.14

- Updated deprecated `text-decoration-skip` property to `text-decoration-skip-ink`

### v2.0.13

- Removed uikit references

### v2.0.12

- Change code background colours

### v2.0.11

- Update dependencies

### v2.0.10

- Removing web pack dev server, updating dependencies

### v2.0.9

- Made URL for external links visible in print preview

### v2.0.8

- Fixed build scripts for Windows

### v2.0.7

- Replace node-sass with sass

### v2.0.6

- Change npm run watch browser-sync location

### v2.0.5

- Update dependencies

### v2.0.4

- Fix typo in homepage link

### v2.0.3

- Changing homepage link

### v2.0.2

- Tweaked selection opacity for images, video and iframes so that they are slightly visisble when selected

### v2.0.1

- Fixed dependencies

### v2.0.0

- Bumped core version which changed to focus color and border/muted color mix

### v1.0.0

- Moved to AU namespace
- Added new color themes with dark and alt variants
- Added a new 4px based spacing system via line-height

### v0.1.2

- Moved to System fonts

### v0.1.1

- The color contrast of the `kbd` element was not sufficient enough.

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
