# @truecms/design-system

## 1.1.2

### Patch Changes

- Publish the Sass deprecation cleanup and current security dependency updates.
- Updated dependencies
  - @truecms/core@6.0.1
  - @truecms/control-input@5.0.1
  - @truecms/grid-12@4.0.1
  - @truecms/responsive-media@4.0.1
  - @truecms/select@4.0.1
  - @truecms/side-nav@7.0.2
  - @truecms/text-inputs@4.0.1
  - @truecms/accordion@9.0.1
  - @truecms/body@4.0.1
  - @truecms/breadcrumbs@5.0.2
  - @truecms/buttons@5.0.2
  - @truecms/callout@5.0.1
  - @truecms/card@2.0.1
  - @truecms/cta-link@4.0.2
  - @truecms/direction-links@5.0.2
  - @truecms/footer@5.0.1
  - @truecms/form@2.0.1
  - @truecms/header@6.0.2
  - @truecms/headings@4.0.1
  - @truecms/inpage-nav@5.0.2
  - @truecms/keyword-list@5.0.2
  - @truecms/link-list@5.0.2
  - @truecms/main-nav@3.0.2
  - @truecms/page-alerts@4.0.1
  - @truecms/progress-indicator@5.0.2
  - @truecms/searchbox@2.0.2
  - @truecms/skip-link@4.0.1
  - @truecms/table@2.0.1
  - @truecms/tags@6.0.2

## 1.1.1

### Patch Changes

- Republish the unified design system package against the latest patched component releases after the Dependabot security updates.

## 1.1.0

### Minor Changes

- c7b0708: Expand the unified design-system package so a GovCMS UI-Kit consumer can install a single `@truecms/design-system` dependency and still resolve the full Drupal starter theme package surface during build and tarball install verification. Also broaden the Drupal CSS entrypoints to build from source dependency entrypoints in a clean checkout.

## 1.0.0

### Major Changes

- Major release for modern-stack migration and upstream package refactoring baseline.

### Minor Changes

- 5c50990: Introduce the unified Vite-based GovAU design system package that produces React components and Drupal-compatible CSS bundles from a single build, and wire npm release workflows so the unified package can be built, tested, and published alongside existing component packages.

### Patch Changes

- Updated dependencies
  - @truecms/accordion@9.0.0
  - @truecms/buttons@5.0.0
  - @truecms/header@6.0.0
