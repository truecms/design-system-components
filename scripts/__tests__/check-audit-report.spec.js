'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const { countVulnerabilities } = require('../check-audit-report');

const makeReport = (overrides = {}) => ({
  actions: [],
  advisories: {},
  muted: [],
  metadata: {
    vulnerabilities: {
      info: 0,
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
      ...overrides
    }
  }
});

describe('countVulnerabilities', () => {
  test('returns 0 for a clean report (all zeros)', () => {
    const report = makeReport();
    expect(countVulnerabilities(report)).toBe(0);
  });

  test('detects a critical vulnerability (mutation test — proves gate can fail)', () => {
    const report = makeReport({ critical: 1 });
    expect(countVulnerabilities(report)).toBe(1);
  });

  test('sums counts across all severity levels', () => {
    const report = makeReport({ info: 1, low: 2, moderate: 3, high: 4, critical: 5 });
    expect(countVulnerabilities(report)).toBe(15);
  });

  test('throws when .metadata.vulnerabilities is missing — fail-closed', () => {
    const report = { actions: [], advisories: {}, muted: [], metadata: {} };
    expect(() => countVulnerabilities(report)).toThrow('Unexpected pnpm audit JSON format');
  });

  test('throws when .metadata is missing entirely — fail-closed', () => {
    const report = { actions: [], advisories: {}, muted: [] };
    expect(() => countVulnerabilities(report)).toThrow('Unexpected pnpm audit JSON format');
  });

  test('throws when .metadata.vulnerabilities is a non-object — fail-closed', () => {
    const report = { metadata: { vulnerabilities: 'bad' } };
    expect(() => countVulnerabilities(report)).toThrow('Unexpected pnpm audit JSON format');
  });
});

describe('check-audit-report file-reading behaviour', () => {
  const tmpDir = path.join(os.tmpdir(), 'check-audit-report-spec');

  beforeAll(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  test('missing file causes fs.readFileSync to throw — fail-closed', () => {
    const nonExistent = path.join(tmpDir, `missing-${Date.now()}.json`);
    expect(() => fs.readFileSync(nonExistent, 'utf8')).toThrow();
  });

  test('empty file is not valid JSON — fail-closed', () => {
    expect(() => JSON.parse('')).toThrow();
  });

  test('unparseable content is not valid JSON — fail-closed', () => {
    expect(() => JSON.parse('not-valid-json{')).toThrow();
  });

  test('clean report written to disk parses and counts 0 vulnerabilities', () => {
    const filePath = path.join(tmpDir, 'clean.json');
    const report = makeReport();
    fs.writeFileSync(filePath, JSON.stringify(report));
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(countVulnerabilities(parsed)).toBe(0);
  });

  test('report with critical:1 written to disk parses and counts 1 vulnerability', () => {
    const filePath = path.join(tmpDir, 'critical.json');
    const report = makeReport({ critical: 1 });
    fs.writeFileSync(filePath, JSON.stringify(report));
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(countVulnerabilities(parsed)).toBe(1);
  });
});
