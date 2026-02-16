# Install + Apply: GovCMS UIKit Migration (`1.x` branch)

This is the assistant entrypoint for the `1.x` maintenance branch.

## Use in any assistant

Ask your assistant to:

```text
Fetch and follow instructions from https://raw.githubusercontent.com/truecms/design-system-components/refs/heads/1.x/docs/installation/INSTRUCTIONS.md
```

If you need instructions from another branch, replace `1.x` in the URL with the exact branch name.

## Required migration inputs

- `PROJECT_ROOT` (path to the Drupal project)
- `THEME_DIR` (primary sub-theme path, absolute or relative to `PROJECT_ROOT`)
- `BASE_THEME_DIR` (optional explicit base theme path; otherwise auto-resolved from `THEME_DIR` `.info.yml`)
