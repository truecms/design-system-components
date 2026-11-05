import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

// Node 22 can load Puppeteer's ESM entry point. Jest's CommonJS runtime cannot.
// Run the real accessibility scanner in Node and return its complete result.
const scan = `
  const pa11y = require('pa11y');
  pa11y(process.argv[1], JSON.parse(process.argv[2])).then(result => {
    process.stdout.write(JSON.stringify(result));
  }).catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
`;

export default async function pa11y(url: string, options: Record<string, unknown>) {
  const { stdout } = await run(process.execPath, [
    '--eval', scan, url, JSON.stringify(options),
  ], { cwd: process.cwd(), maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(stdout);
}
