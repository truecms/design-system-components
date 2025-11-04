'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  parseArgs,
  recordMetric,
  finalizeMetrics,
  findBaseline
} = require('../performance-metrics');

describe('parseArgs', () => {
  test('parses command arguments with flags', () => {
    const { command, args } = parseArgs(['record', '--step', 'install', '--duration', '12.5']);
    expect(command).toBe('record');
    expect(args.step).toBe('install');
    expect(args.duration).toBeCloseTo(12.5);
  });
});

describe('findBaseline', () => {
  test('resolves matrix-specific baseline', () => {
    const baseline = findBaseline(
      { matrices: { '22.x': { install: 10 }, default: { install: 20 } } },
      '22.x'
    );
    expect(baseline.install).toBe(10);
  });

  test('falls back to default baseline', () => {
    const baseline = findBaseline(
      { matrices: { default: { install: 25 } } },
      'lts/*'
    );
    expect(baseline.install).toBe(25);
  });
});

describe('recordMetric', () => {
  test('persists recorded durations', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-record-'));
    const outputPath = path.join(tempDir, 'output.json');

    recordMetric({ outputPath, matrixLabel: '22.x' }, { step: 'install', duration: 32 });
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

    expect(data.records['22.x'].install.durationSeconds).toBe(32);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});

describe('finalizeMetrics', () => {
  test('creates summary and detects regressions', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'perf-finalize-'));
    const outputPath = path.join(tempDir, 'output.json');
    const baselinePath = path.join(tempDir, 'baseline.json');

    fs.writeFileSync(
      baselinePath,
      JSON.stringify({ threshold: 0.25, matrices: { default: { install: 100 } } })
    );

    recordMetric({ outputPath, matrixLabel: 'default' }, { step: 'install', duration: 80 });

    expect(() => {
      finalizeMetrics({
        outputPath,
        baselinePath,
        matrixLabel: 'default',
        threshold: 0.25,
        summaryPath: path.join(tempDir, 'summary.json')
      });
    }).not.toThrow();

    const summary = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    expect(summary.results.rows[0].status).toBe('pass');

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
