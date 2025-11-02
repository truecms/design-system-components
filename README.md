# GOV.AU Design System Components (Node 22 modernisation)

> This repository is a modernisation fork of the Australian Government Design System components. The upstream service was decommissioned in 2020; to keep long-running programmes unblocked we migrated the code to the TrueCMS GitHub organisation, continue to publish under the new `@truecms` npm scope, and mirror the legacy `@gov.au/*` tags so existing consumers remain supported.

This migration allows the maintainers to provide funded support for agencies and vendors who still rely on the original component APIs. Active development now happens in the open under the TrueCMS banner, but compatibility guarantees, accessibility goals, and public licensing remain unchanged.

## Documentation & previews

- Production preview site: <https://design-system-components.truecms.com.au/>
- Pull requests trigger Cloudflare preview builds linked from the Checks tab.
- Contributor guides live under [`docs/`](./docs/) with focused walkthroughs for publishing, Drupal integration, and migration steps.

## Runtime requirements

| Tool    | Minimum | Recommended |
|---------|---------|-------------|
| Node.js | 22.0.0  | 22.x (Active LTS) |
| npm     | 10.0.0  | 10.x bundled with Node 22 |
| pnpm    | 9.0.0   | 9.12.x via Corepack |

Earlier Node releases are no longer supported. Automated workflows and published packages declare these engine constraints to prevent accidental installs on unsupported runtimes.

## Local development

1. Use `nvm` (or your preferred version manager) to select Node 22:
   ```sh
   nvm install 22
   nvm use 22
   ```
2. Enable Corepack so pnpm 9 is available:
   ```sh
   corepack enable
   corepack prepare pnpm@9 --activate
   ```
3. Install workspace dependencies and refresh the lockfile:
   ```sh
   pnpm run bootstrap
   ```
4. Build the component suites:
   ```sh
   pnpm run build
   ```
5. Execute the full verification sweep (Jest unit tests, Pa11y accessibility, helper smoke tests, and bundle parity checks):
   ```sh
   pnpm run test
   ```
6. For targeted component checks you can scope commands, for example `pnpm --filter @truecms/buttons run build`.

All scripts assume Node 22. Running them under earlier versions will emit `EBADENGINE` warnings or fail during dependency installation.

## Automation workflows

| Workflow | Location | Trigger | Purpose |
|----------|----------|---------|---------|
| Install Check | `.github/workflows/install-check.yml` | `push`, `pull_request`, `workflow_dispatch` | Runs Node 22 and latest LTS matrices, performs clean `pnpm install --frozen-lockfile` installs, builds the workspace, runs tests, audits dependencies, builds the site bundle, and verifies that every package tarball installs cleanly. |
| Cloudflare Pages Deploy | `.github/workflows/cloudflare-pages.yml` | `push` (main), `pull_request` | Builds the documentation site with Node 22 and deploys previews and production releases to Cloudflare Pages using the configured secrets. |
| npm Release | `.github/workflows/npm-release.yml` | `workflow_dispatch`, `release`, `push` tags | Authenticates with npm, runs the pnpm build/test pipeline (including audits and site build), and publishes packages through Changesets to the configurable npm scope (default `@truecms`) and dist-tag, with provenance enabled. |

Refer to [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details on invoking these workflows manually during reviews.

## Release process

Releases are orchestrated with Changesets and pnpm:

1. Collect changes using `pnpm changeset` and merge the generated markdown files.
2. When ready to publish, trigger the **npm Release** workflow from the GitHub Actions tab. Supply `dry_run=false` once a release candidate is approved, or keep the default `true` for validation.
3. The workflow runs `pnpm run build`, `pnpm run test`, `pnpm run build:site-dist`, and `pnpm run release` (Changesets publish) before pushing tags to npm under the selected scope.
4. Release artefacts are mirrored to the legacy `@gov.au/*` names via npm dist-tags so downstream teams can opt in at their own pace.

## Support and escalation

Open issues or questions on the [GitHub issue tracker](https://github.com/truecms/design-system-components/issues). The modernization maintainers triage Node compatibility reports twice weekly and follow the escalation path documented in [`SUPPORT.md`](./SUPPORT.md) to keep FR-005 monitoring requirements in place.

## Repository layout

- `packages/` – component packages, each with its own README and CHANGELOG.
- `scripts/` – build helpers for Sass/PostCSS, accessibility automation, and migration tooling.
- `.github/workflows/` – Install Check, Cloudflare Pages, and npm Release pipelines.
- `specs/001-already-began-task/` – design artefacts driving the Node 22 initiative (plan, research, tasks, and checklists).
- `docs/` – platform-specific guides such as Drupal integration, publishing, and migration from the legacy namespace.

For additional implementation context, see [`docs/wiki/node-22-modernisation.md`](./docs/wiki/node-22-modernisation.md) and the research log in `specs/001-already-began-task/research.md`.
