@truecms/table CHANGELOG

## 1.0.2

### Patch Changes

- 66289be: Initial @truecms publish: enable GHA fallback and stage a minimal patch bump across all public packages to produce a release plan for a `latest` publication.
- Updated dependencies [66289be]
  - @truecms/core@5.0.2

## 1.0.1

### Patch Changes

- ba15a33: Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
- Updated dependencies [ba15a33]
  - @truecms/core@5.0.1

## 1.0.0

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

- [v1.0.0 - 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.](#v100)
- [v0.2.1 - Update core package dependency to use the latest version](#v021)
- [v0.2.0 - Refactor sass, first cell header option](#v020)
- [v0.1.3 - Remove pancake js plugin from package json](#v013)
- [v0.1.2 - Utilise the `font-variant` property for numeric table cells](#v012)
- [v0.1.1 - Update font for numerical cells](#v011)
- [v0.1.0 - 💥 Initial version](#v010)

---

## Release History

### v1.0.0

- 7f941cd: Document stewardship responsibilities under the TrueCMS organisation, lock the Node 22 baseline into the governance docs, and ship bundle parity plus dry-run release safeguards so Drupal 11 users and npm consumers remain supported.
- Updated dependencies [7f941cd]
- # @truecms/core@5.0.0

### v0.2.1

- Update core package dependency to use the latest version

### v0.2.0

- Refactor sass, first cell header option

### v0.1.3

- Remove pancake js plugin from package json

### v0.1.2

- Utilise the `font-variant` property for numeric table cells

### v0.1.1

- Update font for numerical cells
- Correct typos in readme and JSdoc for react caption component
- Adjust colours slightly to match designs

### v0.1.0

- 💥 Initial version

**[⬆ back to top](#contents)**

# };
