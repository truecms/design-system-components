'use strict';

const {
  determineReleaseParams,
  coerceBoolean
} = require('../determine-release-params');

describe('coerceBoolean', () => {
  test('falls back to default when value is undefined', () => {
    expect(coerceBoolean(undefined, true)).toBe(true);
    expect(coerceBoolean(undefined, false)).toBe(false);
  });

  test('recognises string representations', () => {
    expect(coerceBoolean('true')).toBe(true);
    expect(coerceBoolean('FALSE')).toBe(false);
    expect(coerceBoolean('On')).toBe(true);
    expect(coerceBoolean('off')).toBe(false);
  });

  test('returns fallback when value is unrecognised', () => {
    expect(coerceBoolean('maybe', true)).toBe(true);
    expect(coerceBoolean('unknown', false)).toBe(false);
  });
});

describe('determineReleaseParams', () => {
  test('defaults to @truecms latest dry-run for workflow dispatch', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'workflow_dispatch'
    });

    expect(result).toEqual(
      expect.objectContaining({
        scope: '@truecms',
        distTag: 'latest',
        dryRun: true
      })
    );
  });

  test('respects manual inputs for workflow dispatch', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'workflow_dispatch',
      INPUT_SCOPE: '@custom',
      INPUT_DIST_TAG: 'next',
      INPUT_DRY_RUN: 'false'
    });

    expect(result).toEqual(
      expect.objectContaining({
        scope: '@custom',
        distTag: 'next',
        dryRun: false
      })
    );
  });

  test('release event forces latest without dry-run', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'release'
    });

    expect(result).toEqual(
      expect.objectContaining({
        distTag: 'latest',
        dryRun: false
      })
    );
  });

  test('push tag defaults to latest without dry-run', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/tags/v1.2.3',
      GITHUB_REF_NAME: 'v1.2.3'
    });

    expect(result).toEqual(
      expect.objectContaining({
        distTag: 'latest',
        dryRun: false
      })
    );
  });

  test('dev tag maps to dev dist-tag with dry-run by default', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/tags/v1.2.3-dev.0',
      GITHUB_REF_NAME: 'v1.2.3-dev.0'
    });

    expect(result).toEqual(
      expect.objectContaining({
        distTag: 'dev',
        dryRun: true
      })
    );
  });

  test('force publish flag disables dry-run for dev tag', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/tags/v1.2.3-dev.0',
      GITHUB_REF_NAME: 'v1.2.3-dev.0',
      FORCE_PUBLISH_FROM_TAG: 'true'
    });

    expect(result).toEqual(
      expect.objectContaining({
        distTag: 'dev',
        dryRun: false
      })
    );
  });

  test('pre-release tags map to next dist-tag', () => {
    const result = determineReleaseParams({
      GITHUB_EVENT_NAME: 'push',
      GITHUB_REF: 'refs/tags/v1.2.3-rc.1',
      GITHUB_REF_NAME: 'v1.2.3-rc.1'
    });

    expect(result).toEqual(
      expect.objectContaining({
        distTag: 'next',
        dryRun: true
      })
    );
  });
});
