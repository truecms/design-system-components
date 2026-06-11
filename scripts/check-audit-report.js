'use strict';

const fs = require('fs');

const DEFAULT_REPORT_PATH = 'audit-report.json';

const SEVERITY_KEYS = ['info', 'low', 'moderate', 'high', 'critical'];

/**
 * Count total vulnerabilities from a parsed pnpm audit JSON report.
 * Expects report.metadata.vulnerabilities to be an object with severity keys.
 *
 * @param {object} report - Parsed pnpm audit JSON output.
 * @returns {number} Total vulnerability count across all severities.
 */
const countVulnerabilities = (report) => {
  const vulns = report.metadata && report.metadata.vulnerabilities;
  if (!vulns || typeof vulns !== 'object') {
    throw new Error('Unexpected pnpm audit JSON format');
  }

  return SEVERITY_KEYS.reduce((sum, key) => sum + (Number(vulns[key]) || 0), 0);
};

const run = () => {
  const reportPath = process.argv[2] || DEFAULT_REPORT_PATH;

  let raw;
  try {
    raw = fs.readFileSync(reportPath, 'utf8');
  } catch (err) {
    console.error(`Error: Could not read audit report at '${reportPath}': ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (!raw || raw.trim() === '') {
    console.error(`Error: Audit report at '${reportPath}' is empty.`);
    process.exitCode = 1;
    return;
  }

  let report;
  try {
    report = JSON.parse(raw);
  } catch (err) {
    console.error(`Error: Audit report at '${reportPath}' is not valid JSON: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  let total;
  try {
    total = countVulnerabilities(report);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (total > 0) {
    const vulns = report.metadata.vulnerabilities;
    console.error('Vulnerabilities detected in production dependency graph:');
    for (const key of SEVERITY_KEYS) {
      if (vulns[key]) {
        console.error(`  ${key}: ${vulns[key]}`);
      }
    }
    console.error(`  total: ${total}`);
    console.error('::error::Vulnerabilities detected in production dependency graph');
    process.exitCode = 1;
    return;
  }

  console.log('No production vulnerabilities found.');
};

if (require.main === module) {
  run();
}

module.exports = { countVulnerabilities };
