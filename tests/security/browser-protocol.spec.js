'use strict';

const { execFileSync } = require('child_process');

// Use Node's module loader for Puppeteer's ESM protocol dependency.
const parseNavigation = `
  const Path = require('path');
  const { pathToFileURL } = require('url');
  const puppeteer = require.resolve('puppeteer');
  const core = require.resolve('puppeteer-core', { paths: [Path.dirname(puppeteer)] });
  const bidi = require.resolve('chromium-bidi', { paths: [Path.dirname(core)] });
  const parserPath = Path.join(Path.dirname(bidi), 'protocol-parser/protocol-parser.js');
  import(pathToFileURL(parserPath).href).then(parser => {
    try {
      const result = parser.BrowsingContext.parseNavigateParams(JSON.parse(process.argv[1]));
      console.log(JSON.stringify({ result }));
    } catch (error) {
      console.log(JSON.stringify({ type: error.constructor.name, code: error.error, message: error.message }));
    }
  }).catch(error => { console.error(error); process.exitCode = 1; });
`;

function parse(params) {
  return JSON.parse(execFileSync(process.execPath, ['--eval', parseNavigation, JSON.stringify(params)], {
    cwd: require('path').resolve(__dirname, '../..'),
    encoding: 'utf8',
  }));
}

describe('Puppeteer WebDriver BiDi schema compatibility', () => {
  test('accepts a valid navigation command', () => {
    const command = { context: 'example-context', url: 'https://example.com/', wait: 'complete' };
    expect(parse(command)).toEqual({ result: command });
  });

  test.each([{}, { context: 12, url: false }])('reports invalid arguments without a schema TypeError: %j', command => {
    const result = parse(command);
    expect(result.type).toBe('InvalidArgumentException');
    expect(result.code).toBe('invalid argument');
    expect(result.message).toContain('context');
    expect(result.message).toContain('url');
  });
});
