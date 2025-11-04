@truecms/tags CHANGELOG

## 5.0.1

### Patch Changes

- ba15a33: Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
- Updated dependencies [ba15a33]
  - @truecms/core@5.0.1

## 5.0.0

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

- [v5.0.0 - 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.](#v500)
- [v4.0.1 - Update core package dependency to use the latest version](#v401)
- [v4.0.0 - Update tags so they no longer have to be in a list](#v400)
- [v3.1.7 - Remove --save-dev flag from readme instructions](#v317)
- [v3.1.6 - Removed unused `Fragment` React import](#v316)
- [v3.1.5 - Removed uikit references](#v315)
- [v3.1.4 - Update dependencies](#v314)
- [v3.1.3 - Removing web pack dev server, updating dependencies](#v313)
- [v3.1.2 - Fixed build scripts for Windows](#v312)
- [v3.1.1 - Replace node-sass with sass](#v311)
- [v3.1.0 - React router support](#v310)
- [v3.0.0 - Remove support for Description List <DL> for accessibility, Update dependencies](#v300)
- [v2.0.2 - Change homepage links](#v202)
- [v2.0.1 - Fix dependencies](#v201)
- [v2.0.0 - Change to focus colour and border/muted color mix](#v200)
- [v1.0.0 - Moved to AU namespace, added new color themes and spacing](#v100)
- [v0.3.0 - Added pancake-react plugin, ES5 main file](#v030)
- [v0.2.0 - Added react component](#v020)
- [v0.1.1 - Fixed a11y contrast issue](#v011)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v5.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- # @truecms/core@5.0.0

### v4.0.1

- Update core package dependency to use the latest version

### v4.0.0

- Update tags so they no longer have to be in a list
- Refactored single markup

### v3.1.7

- Remove --save-dev flag from readme instructions

### v3.1.6

- Removed unused `Fragment` React import

### v3.1.5

- Removed uikit references

### v3.1.4

- Update dependencies

### v3.1.3

- Removing web pack dev server, updating dependencies

### v3.1.2

- Fixed build scripts for Windows

### v3.1.1

- Replace node-sass with sass

### v3.1.0

- React router support
- Change npm run watch browser-sync location

### v3.0.0

- Remove support for Description List <DL> for accessibility
- Update dependencies

### v2.0.2

- Change homepage links

### v2.0.1

- Fixed dependencies

### v2.0.0

- Bumped core version which changed to focus color and border/muted color mix

### v1.0.0

- Moved to AU namespace
- Added new color themes with dark and alt variants
- Added a new 4px based spacing system via line-height

### v0.3.0

- Added pancake-react plugin
- Added transpiled react ES5 file as main entry file for `package.json`
- Added compiled css file that is automatically imported by ES5 react file

### v0.2.0

- Added react component

### v0.1.1

- The color contrast of the border was not sufficient enough.

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
