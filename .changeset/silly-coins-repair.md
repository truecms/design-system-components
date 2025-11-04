---
"@truecms/accordion": patch
"@truecms/animate": patch
"@truecms/body": patch
"@truecms/breadcrumbs": patch
"@truecms/buttons": patch
"@truecms/callout": patch
"@truecms/card": patch
"@truecms/control-input": patch
"@truecms/core": patch
"@truecms/cta-link": patch
"@truecms/direction-links": patch
"@truecms/footer": patch
"@truecms/form": patch
"@truecms/grid-12": patch
"@truecms/header": patch
"@truecms/headings": patch
"@truecms/inpage-nav": patch
"@truecms/keyword-list": patch
"@truecms/link-list": patch
"@truecms/main-nav": patch
"@truecms/page-alerts": patch
"@truecms/progress-indicator": patch
"@truecms/responsive-media": patch
"@truecms/searchbox": patch
"@truecms/select": patch
"@truecms/side-nav": patch
"@truecms/skip-link": patch
"@truecms/table": patch
"@truecms/tags": patch
"@truecms/text-inputs": patch
---

Migrates the Design System from @govau to @truecms and standardises on Node.js 22+ with pnpm/Corepack across the workspace. All packages are re-scoped and released as new majors, dependencies refreshed to resolve known vulnerabilities (npm audit: 0), Pancake tooling ported to @truecms, and CI/CD moved from CircleCI to GitHub Actions with pnpm-enabled Cloudflare Pages. We added/validated tests (Jest, Pa11y), bundle-parity and performance checks, and documented Drupal 11 compatibility. This is an intentional major for scope/engines changes; no intentional breaking API or CSS changes beyond the package scope. Consumers must update imports from @govau/_ to @truecms/_ and run on Node 22+.
