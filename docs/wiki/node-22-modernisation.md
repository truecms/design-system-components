# Node 22 modernisation summary

This page mirrors the guidance that will be published to the GitHub Wiki. It explains the Node.js 22 upgrade, the new automation workflows, and the steps maintainers follow to publish releases.

## Upgrade overview

- **Runtime baseline**: Node.js `>=22.0.0` with npm `>=10.0.0` and pnpm `>=9.0.0`.
- **Tooling updates**: Dart Sass (`sass`) replaces `node-sass`; Jest 29, Puppeteer, Pa11y, and other devDependencies are aligned with Node 22.
- **Workspace orchestration**: pnpm 9 manages dependencies and scripts; Changesets handles versioning and release notes.
- **Publishing scope**: Packages are released under `@truecms` while preserving the legacy `@gov.au/*` naming via dist-tags.
- **Automation**: Install Check orchestration, reusable quality gates, and npm Release workflows enforce the new baseline across CI and releases.
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

Logs from these runs feed the Compatibility Test Matrix in `specs/001-already-began-task/research.md`.

## Continuous integration workflows

### Install Check (`.github/workflows/install-check.yml`)

- **Triggers**: `push`, `pull_request`, `workflow_dispatch`
- **Node matrix**: `['22.x', 'lts/*']`
- **Key steps**: Orchestrates reusable quality gates for install/build/test/site-dist/audit/tarball-install verification, then runs dry-run release validation.
- **When to run manually**: After dependency upgrades or package manifest changes. Use the GitHub UI (Actions → Install Check → Run workflow) or `gh workflow run install-check.yml`.
- **Artifacts**: Tarball summaries are stored under `dist/tarballs` during the job and cleaned up automatically.

### Reusable Quality Gates (`.github/workflows/reusable-quality-gates.yml`)

- **Triggers**: `workflow_call`
- **Purpose**: Shared CI unit used by Install Check and npm Release validation. Keeps install/build/test/audit/tarball checks consistent between pull request and release paths.
- **Checklist**: Keep this workflow as the single source of truth for quality-gate steps and artifact conventions.

### npm Release (`.github/workflows/npm-release.yml`)

- **Triggers**: `workflow_dispatch`, `release` (published)
- **Purpose**: Run release validation through reusable quality gates, then execute `pnpm run release` (Changesets publish) with configurable `npm_scope`, `dist_tag`, and `dry_run` inputs.
- **Secrets**: `NPM_TOKEN_TRUECMS` supplying publish rights.
- **Usage**: Run a dry run by leaving `dry_run` true; set it to false for real publishes once maintainers approve the release plan.

## Release checklist

1. Confirm Install Check is green on the release branch.
2. Ensure all required documentation and package changelog updates are merged (see `specs/001-already-began-task/checklists/package-docs.md`).
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
| Install Check fails during `pnpm pack` | Legacy dependency requires Node <22 | Replace or upgrade the dependency; rerun the workflow. |
| npm Release dry run reports `EBADENGINE` | Workflow ran under the wrong Node version | Ensure the job uses Node 22 (default in workflow). Do not override `node-version`. |
| pnpm install fails locally | Corepack not enabled or pnpm version drift | Re-run `corepack enable` and `corepack prepare pnpm@9 --activate`. |

## Next steps

- Replace remaining `@gov.au/pancake-*` dependencies with Node 22 compatible alternatives (tracked in Phase 6 tasks).
- Keep the Install Check workflow on pnpm commands and monitor tarball verification after Pancake replacements land (Task T205 complete).
- Complete the package README/CHANGELOG sweep using the checklist.
- Continue recording compatibility runs and escalations in `specs/001-already-began-task/research.md` to satisfy monitoring requirement FR-005.
