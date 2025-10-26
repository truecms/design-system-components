# Node 22 modernisation summary

This page mirrors the guidance that will be published to the GitHub Wiki. It explains the Node.js 22 upgrade, the new automation workflows, and the steps maintainers follow to publish releases.

## Upgrade overview

- **Runtime baseline**: Node.js `>=22.0.0` with npm `>=10.0.0` and pnpm `>=9.0.0`.
- **Tooling updates**: Dart Sass (`sass`) replaces `node-sass`; Jest 29, Puppeteer, Pa11y, and other devDependencies are aligned with Node 22.
- **Workspace orchestration**: pnpm 9 manages dependencies and scripts; Changesets handles versioning and release notes.
- **Publishing scope**: Packages are released under `@truecms` while preserving the legacy `@gov.au/*` naming via dist-tags.
- **Automation**: Install Check, Cloudflare Pages, and npm Release workflows enforce the new baseline across CI and deployments.
- **Documentation site**: Production previews publish to <https://design-system-components.truecms.com.au/> with Cloudflare preview links for pull requests.

## Runtime and tooling requirements

| Tool | Minimum | Notes |
|------|---------|-------|
| Node.js | 22.0.0 | Use `nvm` (`nvm install 22 && nvm use 22`) or matching container images. |
| npm | 10.0.0 | Bundled with Node 22. Required for Install Check tarball validation. |
| pnpm | 9.0.0 | Enable via Corepack (`corepack enable && corepack prepare pnpm@9 --activate`). |

### Local setup checklist

1. `nvm use 22`
2. `corepack enable`
3. `pnpm run bootstrap`
4. `pnpm run build`
5. `pnpm run test`
6. `pnpm changeset` (record release notes when applicable)

Logs from these runs feed the Compatibility Test Matrix in `specs/001-modernise-library-run/research.md`.

## Continuous integration workflows

### Install Check (`.github/workflows/install-check.yml`)

- **Triggers**: `push`, `pull_request`, `workflow_dispatch`
- **Node matrix**: `['22.x', 'lts/*']`
- **Key steps**: `npm ci`, `npm run bootstrap`, `npm run build`, `npm run test`, per-package `npm pack` with installation verification.
- **When to run manually**: After dependency upgrades or package manifest changes. Use the GitHub UI (Actions → Install Check → Run workflow) or `gh workflow run install-check.yml`.
- **Artifacts**: Tarball summaries are stored under `dist/tarballs` during the job and cleaned up automatically.

### Cloudflare Pages deploy (`.github/workflows/cloudflare-pages.yml`)

- **Triggers**: `pull_request` (preview), `push` to `main` (production), optional `workflow_dispatch`.
- **Purpose**: Build the documentation site with Node 22 and deploy to Cloudflare Pages. Requires secrets: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME`, `CLOUDFLARE_API_TOKEN`.
- **Checklist**: Ensure site build scripts read from the pnpm workspace and that preview URLs are posted as pull request comments.

### npm Release (`.github/workflows/npm-release.yml`)

- **Triggers**: `workflow_dispatch`, `release` (published)
- **Purpose**: Run pnpm install/build/test and execute `pnpm run release` (Changesets publish) with configurable `npm_scope`, `dist_tag`, and `dry_run` inputs.
- **Secrets**: `NPM_TOKEN_TRUECMS` supplying publish rights.
- **Usage**: Run a dry run by leaving `dry_run` true; set it to false for real publishes once maintainers approve the release plan.

## Release checklist

1. Confirm Install Check is green on the release branch.
2. Ensure all required documentation and package changelog updates are merged (see `specs/001-modernise-library-run/checklists/package-docs.md`).
3. Run `pnpm changeset` to add release notes if any are missing.
4. Trigger the **npm Release** workflow:
   - Scope defaults to `@truecms`; override if publishing under a different namespace.
   - Choose the appropriate `dist_tag` (`latest`, `beta`, etc.).
   - Set `dry_run=false` to publish.
5. Monitor the workflow to completion (~15 minutes). Investigate any tarball install failures before retrying.
6. Announce the release summary and link to package changelogs.

## Troubleshooting

| Symptom | Diagnosis | Resolution |
|---------|-----------|------------|
| Install Check fails during `npm pack` | Legacy dependency requires Node <22 | Replace or upgrade the dependency; rerun the workflow. |
| npm Release dry run reports `EBADENGINE` | Workflow ran under the wrong Node version | Ensure the job uses Node 22 (default in workflow). Do not override `node-version`. |
| pnpm install fails locally | Corepack not enabled or pnpm version drift | Re-run `corepack enable` and `corepack prepare pnpm@9 --activate`. |

## Next steps

- Replace remaining `@gov.au/pancake-*` dependencies with Node 22 compatible alternatives (tracked in Phase 6 tasks).
- Convert the Install Check workflow to pnpm commands once the Pancake migration is complete (Task T205).
- Complete the package README/CHANGELOG sweep using the checklist.
- Continue recording compatibility runs and escalations in `specs/001-modernise-library-run/research.md` to satisfy monitoring requirement FR-005.
