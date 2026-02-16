# Install + Apply: GovCMS UIKit Upgrade to current `@truecms`

This is the canonical installation and execution entrypoint for AI coding assistants.
It covers both upgrade paths:

- `@gov.au/*` -> current `@truecms/*` major
- previous `@truecms/*` major -> current `@truecms/*` major

## Use in any assistant

Ask your assistant to:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/2.x/docs/installation/INSTRUCTIONS.md
```

If you need branch-specific instructions before merge (for example `feature/d11`), replace `2.x` in the URL with your branch name.

## Required migration inputs

- `PROJECT_ROOT` (path to the Drupal project)
- `THEME_DIR` (primary sub-theme path, absolute or relative to `PROJECT_ROOT`)
- `BASE_THEME_DIR` (optional explicit base theme path; otherwise auto-resolved from `THEME_DIR` `.info.yml`)
