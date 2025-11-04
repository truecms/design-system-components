'use strict';

const {
  parseArgs,
  formatReportLines
} = require('../verify-bundles');

describe('parseArgs', () => {
  const originalEnvReport = process.env.BUNDLE_PARITY_REPORT_PATH;
  const originalEnvLog = process.env.BUNDLE_PARITY_LOG_PATH;

  afterEach(() => {
    process.env.BUNDLE_PARITY_REPORT_PATH = originalEnvReport;
    process.env.BUNDLE_PARITY_LOG_PATH = originalEnvLog;
  });

  test('uses environment defaults when provided', () => {
    process.env.BUNDLE_PARITY_REPORT_PATH = 'dist/reports/default.json';
    process.env.BUNDLE_PARITY_LOG_PATH = 'dist/reports/default.log';

    const options = parseArgs([]);

    expect(options).toEqual({
      reportPath: 'dist/reports/default.json',
      logPath: 'dist/reports/default.log'
    });
  });

  test('allows CLI overrides for report and log paths', () => {
    const options = parseArgs([
      '--report',
      'out/report.json',
      '--log',
      'out/report.log'
    ]);

    expect(options).toEqual({
      reportPath: 'out/report.json',
      logPath: 'out/report.log'
    });
  });
});

describe('formatReportLines', () => {
  test('summarises pass/fail status and differences', () => {
    const lines = formatReportLines([
      {
        pkgName: 'accordion',
        status: 'passed',
        missing: [],
        unexpected: [],
        mismatched: []
      },
      {
        pkgName: 'buttons',
        status: 'failed',
        missing: ['lib/js/a.js'],
        unexpected: [],
        mismatched: ['lib/css/b.css']
      }
    ]);

    expect(lines).toEqual([
      'accordion: PASSED',
      'buttons: FAILED',
      '  Missing in actual build:',
      '    - lib/js/a.js',
      '  File content mismatches:',
      '    - lib/css/b.css'
    ]);
  });
});
