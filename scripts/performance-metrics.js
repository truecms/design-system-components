'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_THRESHOLD = 0.25;

const readJsonIfExists = (filePath, fallback = null) => {
  try {
    if (!filePath) {
      return fallback;
    }

    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const contents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(`Unable to read JSON from ${filePath}: ${error.message}`);
  }
};

const writeJson = (filePath, data) => {
  if (!filePath) {
    throw new Error('PERFORMANCE_OUTPUT_PATH is not defined');
  }

  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const writeSummary = (summaryPath, data) => {
  if (!summaryPath) {
    return;
  }

  const directory = path.dirname(summaryPath);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(summaryPath, JSON.stringify(data, null, 2));
};

const appendJobSummary = (rows) => {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }

  const lines = ['| Step | Duration (s) | Baseline (s) | Delta | Status |', '| --- | ---: | ---: | --- | --- |'];

  for (const row of rows) {
    const deltaString = row.deltaPercent === null
      ? 'N/A'
      : `${(row.deltaPercent * 100).toFixed(1)}%`;
    lines.push(`| ${row.step} | ${row.durationSeconds} | ${row.baselineSeconds ?? 'N/A'} | ${deltaString} | ${row.status} |`);
  }

  fs.appendFileSync(summaryPath, `${lines.join('\n')}\n`);
};

const loadOutput = (filePath) => {
  const existing = readJsonIfExists(filePath, {});
  if (!existing.records) {
    return { records: existing }; // allow legacy structure
  }

  return existing;
};

const ensureOptions = () => {
  const outputPath = process.env.PERFORMANCE_OUTPUT_PATH;
  const baselinePath = process.env.PERFORMANCE_BASELINE_PATH;
  const matrixLabel = process.env.PERFORMANCE_MATRIX_LABEL || 'default';
  const summaryPath = process.env.PERFORMANCE_SUMMARY_PATH || null;
  const thresholdEnv = process.env.PERFORMANCE_THRESHOLD;
  const threshold = thresholdEnv ? Number.parseFloat(thresholdEnv) : DEFAULT_THRESHOLD;

  return {
    outputPath,
    baselinePath,
    matrixLabel,
    summaryPath,
    threshold: Number.isFinite(threshold) ? threshold : DEFAULT_THRESHOLD
  };
};

const parseArgs = (argv) => {
  const [command, ...rest] = argv;

  if (!command) {
    throw new Error('Missing command. Expected "record" or "finalize".');
  }

  const args = {};
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === '--step') {
      args.step = rest[++index];
    } else if (token === '--duration') {
      args.duration = Number.parseFloat(rest[++index]);
    } else if (token === '--summary-path') {
      args.summaryPath = rest[++index];
    }
  }

  return { command, args };
};

const recordMetric = ({ outputPath, matrixLabel }, { step, duration }) => {
  if (!step) {
    throw new Error('Missing --step argument for record command.');
  }

  if (!Number.isFinite(duration)) {
    throw new Error('Missing or invalid --duration argument for record command.');
  }

  const output = loadOutput(outputPath);

  if (!output.records) {
    output.records = {};
  }

  if (!output.records[matrixLabel]) {
    output.records[matrixLabel] = {};
  }

  output.records[matrixLabel][step] = {
    durationSeconds: duration,
    recordedAt: new Date().toISOString()
  };

  writeJson(outputPath, output);

  console.log(`Recorded performance metric for ${matrixLabel}:${step} (${duration}s).`);
};

const findBaseline = (baselineData, matrixLabel) => {
  if (!baselineData) {
    return null;
  }

  if (baselineData.matrices) {
    if (baselineData.matrices[matrixLabel]) {
      return baselineData.matrices[matrixLabel];
    }
    if (baselineData.matrices.default) {
      return baselineData.matrices.default;
    }
  }

  return baselineData[matrixLabel] || baselineData.default || null;
};

const finalizeMetrics = (options) => {
  const { outputPath, baselinePath, matrixLabel, threshold, summaryPath } = options;
  const output = loadOutput(outputPath);
  const baselineData = readJsonIfExists(baselinePath, {});
  const matrixRecords = output.records?.[matrixLabel] || {};
  const baseline = findBaseline(baselineData, matrixLabel);
  const rows = [];
  let failureDetected = false;

  const thresholdValue = baselineData.threshold ?? threshold ?? DEFAULT_THRESHOLD;

  for (const [step, details] of Object.entries(matrixRecords)) {
    const durationSeconds = Number(details.durationSeconds);
    const baselineSeconds = baseline ? baseline[step] : undefined;
    let deltaPercent = null;
    let status = 'pass';

    if (baselineSeconds === undefined || baselineSeconds === null) {
      status = 'no-baseline';
    } else if (baselineSeconds === 0) {
      deltaPercent = null;
      status = 'no-baseline';
    } else {
      deltaPercent = (durationSeconds - baselineSeconds) / baselineSeconds;
      if (deltaPercent > thresholdValue) {
        status = 'regressed';
        failureDetected = true;
      }
    }

    rows.push({
      step,
      durationSeconds,
      baselineSeconds: baselineSeconds ?? null,
      deltaPercent,
      status
    });
  }

  writeJson(outputPath, {
    records: output.records || {},
    results: {
      matrix: matrixLabel,
      rows,
      threshold: thresholdValue,
      evaluatedAt: new Date().toISOString()
    }
  });

  writeSummary(summaryPath, rows);
  appendJobSummary(rows);

  rows.forEach((row) => {
    console.log(
      `${row.step}: duration=${row.durationSeconds}s baseline=${row.baselineSeconds ?? 'N/A'} status=${row.status}`
    );
  });

  if (failureDetected) {
    throw new Error(`Performance regression detected for matrix ${matrixLabel}.`);
  }
};

const run = () => {
  const { command, args } = parseArgs(process.argv.slice(2));
  const options = ensureOptions();

  if (args.summaryPath) {
    options.summaryPath = args.summaryPath;
  }

  if (command === 'record') {
    recordMetric(options, args);
    return;
  }

  if (command === 'finalize') {
    finalizeMetrics(options);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
};

if (require.main === module) {
  try {
    run();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  readJsonIfExists,
  recordMetric,
  finalizeMetrics,
  parseArgs,
  findBaseline,
  DEFAULT_THRESHOLD
};
