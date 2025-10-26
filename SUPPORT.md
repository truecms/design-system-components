# Support and escalation policy

The official Australian Government Design System was decommissioned in 2020. This fork continues support for the reusable component packages while modernising the tooling for Node.js 22. Please use the channels and escalation paths below when you need assistance.

## Primary support channels

| Scenario | Channel | Notes |
|----------|---------|-------|
| Bug reports, upgrade blockers, compatibility questions | [GitHub issues](https://github.com/govau/design-system-components/issues/new/choose) | Apply the `node-22-support` label for faster triage. |
| Security disclosures or credential problems | Private GitHub issue addressed to the maintainers | Avoid emailing legacy DTA addresses; they are no longer monitored. |
| Release coordination and npm token access | GitHub issue or discussion tagged `maintainer` | Maintainers respond within one business day. |

Community forums and Slack links from the original project are archived and no longer monitored.

## Node support policy

- **Supported versions**: Node.js `>=22.0.0` with npm `>=10.0.0` and pnpm `>=9.0.0`.
- **Recommended runtime**: Node 22.x Active LTS.
- **Deprecation**: Node 20 and earlier are deprecated. Packages declare `engines` constraints that will cause installs to fail on unsupported versions.
- **Testing**: Install-check and canary publish workflows validate every release on Node 22 and the latest LTS runner.

Consumers who cannot upgrade immediately should remain on the final release tagged `node20-hold` (see package CHANGELOGs) and follow the migration steps below when ready.

## Migration guidance for teams still on Node ≤20

1. Freeze on the latest `node20-hold` dist-tag for each package.
2. Schedule time to upgrade build pipelines and hosts to Node 22.x. We recommend using `nvm` or container images to align environments.
3. Run the following smoke tests in a staging clone of your application:
   ```sh
   nvm install 22
   nvm use 22
   corepack enable
   pnpm install
   pnpm run build
   pnpm run test
   ```
4. Execute `pnpm pack --filter <component>` for the components you rely on and install the tarballs into the staging app to confirm installability.
5. Update your production configuration after the staging run passes.

If you encounter blockers, open a GitHub issue with a reproduction repository or install logs so the maintainers can investigate.

## Escalation cadence (FR-005)

- Maintainers review new issues labelled `node-22-support` every **Monday** and **Thursday** (Canberra time).
- High-severity compatibility regressions (`severity:critical`) trigger an immediate working session among the release engineers and are added to the modernization research log.
- If a regression blocks a release for more than two business days, escalate to the modernization working group via the issue assignee list and open a draft advisory in the repository discussions board.
- All escalations are summarised in the fortnightly status update documented in `specs/001-modernise-library-run/research.md`.

Staying within this cadence keeps monitoring in line with requirement FR-005 and ensures rapid response to any post-release Node 22 issues.
