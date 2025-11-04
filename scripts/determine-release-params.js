'use strict';

const fs = require('fs');
const path = require('path');

const BOOLEAN_TRUE_VALUES = new Set(['true', '1', 'yes', 'y', 'on']);
const BOOLEAN_FALSE_VALUES = new Set(['false', '0', 'no', 'n', 'off']);

const coerceBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalised = String(value).trim().toLowerCase();

  if (BOOLEAN_TRUE_VALUES.has(normalised)) {
    return true;
  }

  if (BOOLEAN_FALSE_VALUES.has(normalised)) {
    return false;
  }

  return fallback;
};

const hasTagSuffix = (tagName, suffix) => tagName.includes(`-${suffix}`);

const determineReleaseParams = (env = process.env) => {
  const eventName = env.GITHUB_EVENT_NAME || '';
  const ref = env.GITHUB_REF || '';
  const refName = env.GITHUB_REF_NAME || '';

  let scope = env.INPUT_SCOPE || env.INPUT_NPM_SCOPE || env.NPM_PUBLISH_SCOPE || '@truecms';
  if (scope && !scope.startsWith('@')) {
    scope = `@${scope}`;
  }

  let distTag = env.INPUT_DIST_TAG || 'latest';
  let dryRun = coerceBoolean(env.INPUT_DRY_RUN, true);

  const forcePublish = coerceBoolean(env.FORCE_PUBLISH_FROM_TAG, false) ||
    coerceBoolean(env.FORCE_PUBLISH, false) ||
    coerceBoolean(env.ALLOW_PUBLISH_FROM_TAG, false);

  let tagName = '';

  if (eventName === 'release') {
    distTag = 'latest';
    dryRun = false;
  }

  const isPushTagEvent = eventName === 'push' && ref.startsWith('refs/tags/');

  if (isPushTagEvent) {
    tagName = refName || ref.replace('refs/tags/', '');
    const lowered = tagName.toLowerCase();

    // Default to latest for semver-compliant release tags.
    distTag = 'latest';
    dryRun = false;

    if (hasTagSuffix(lowered, 'dev')) {
      distTag = 'dev';
      dryRun = !forcePublish;
    } else if (hasTagSuffix(lowered, 'next') || hasTagSuffix(lowered, 'rc') || hasTagSuffix(lowered, 'beta') || hasTagSuffix(lowered, 'alpha')) {
      distTag = 'next';
      dryRun = !forcePublish;
    }
  }

  return {
    scope,
    distTag,
    dryRun,
    tagName,
    eventName
  };
};

const writeGitHubOutputs = (params) => {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    return;
  }

  const lines = [
    `scope=${params.scope}`,
    `dist_tag=${params.distTag}`,
    `dry_run=${params.dryRun ? 'true' : 'false'}`,
    `tag_name=${params.tagName}`
  ];

  fs.appendFileSync(outputPath, `${lines.join('\n')}\n`);
};

if (require.main === module) {
  try {
    const params = determineReleaseParams();
    writeGitHubOutputs(params);

    const summary = [
      `Resolved npm scope: ${params.scope}`,
      `Dist tag: ${params.distTag}`,
      `Dry run: ${params.dryRun ? 'true' : 'false'}`
    ];

    if (params.tagName) {
      summary.push(`Tag name: ${params.tagName}`);
    }

    console.log(summary.join(' | '));
  } catch (error) {
    console.error('Failed to resolve release parameters:', error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  determineReleaseParams,
  coerceBoolean
};
