@truecms/buttons CHANGELOG

## 4.0.2

### Patch Changes

- 66289be: Initial @truecms publish: enable GHA fallback and stage a minimal patch bump across all public packages to produce a release plan for a `latest` publication.
- Updated dependencies [66289be]
  - @truecms/core@5.0.2

## 4.0.1

### Patch Changes

- ba15a33: Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
- Updated dependencies [ba15a33]
  - @truecms/core@5.0.1

## 4.0.0

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

- [v4.0.0 - 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.](#v400)
- [v3.0.8 - Update core package dependency to use the latest version](#v308)
- [v3.0.7 - Remove --save-dev flag from readme instructions](#v307)
- [v3.0.6 - Removed unused `Fragment` React import](#v306)
- [v3.0.5 - Removed uikit references](#v305)
- [v3.0.4 - Update dependencies](#v304)
- [v3.0.3 - Removing web pack dev server, updating dependencies](#v303)
- [v3.0.2 - Fixed build scripts for Windows](#v302)
- [v3.0.1 - Replace node-sass with sass](#v301)
- [v3.0.0 - React router support](#v300)
- [v2.0.3 - Update dependencies](#v203)
- [v2.0.2 - Change homepage link](#v202)
- [v2.0.1 - Fix dependencies](#v201)
- [v2.0.0 - Change to focus colour and border/muted color mix](#v200)
- [v1.0.2 - Fixed issue with secondary button hover IE8](#v102)
- [v1.0.1 - Fixed specificity issue when combined with body](#v101)
- [v1.0.0 - Moved to AU namespace, added new color themes and spacing](#v100)
- [v0.5.0 - Added pancake-react plugin, ES5 main file](#v050)
- [v0.4.0 - Added react component](#v040)
- [v0.3.0 - Fixed px height, added more robust CSS code](#v030)
- [v0.2.0 - Added block modifier](#v020)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v4.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- # @truecms/core@5.0.0

### v3.0.8

- Update core package dependency to use the latest version

### v3.0.7

- Remove --save-dev flag from readme instructions

### v3.0.6

- Removed unused `Fragment` React import

### v3.0.5

- Removed uikit references

### v3.0.4

- Update dependencies

### v3.0.3

- Removing web pack dev server, updating dependencies

### v3.0.2

- Fixed build scripts for Windows

### v3.0.1

- Replace node-sass with sass

### v3.0.0

- Add react router support
- Change npm run watch browser-sync location

### v2.0.3

- Update dependencies

### v2.0.2

- Change homepage link

### v2.0.1

- Fixed dependencies

### v2.0.0

- Bumped core version which changed to focus color and border/muted color mix

### v1.0.2

- Fixed issue with secondary button hover IE8 [312](https://github.com/truecms/design-system-components/issues/312)

### v1.0.1

- Fixed specificity issue when combined with body [197](https://github.com/truecms/design-system-components/issues/197)

### v1.0.0

- Moved to AU namespace
- Added new color themes with dark and alt variants
- Added a new 4px based spacing system via line-height

### v0.5.0

- Added pancake-react plugin
- Added transpiled react ES5 file as main entry file for `package.json`
- Added compiled css file that is automatically imported by ES5 react file

### v0.4.0

- Added react component

### v0.3.0

- Added more robust CSS code ([#162](https://github.com/truecms/design-system-components/issues/162))
- Fixed px values ([#171](https://github.com/truecms/design-system-components/issues/171))

### v0.2.0

- Added block modifier ([#155](https://github.com/truecms/design-system-components/issues/155))

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
