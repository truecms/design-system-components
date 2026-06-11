'use strict';

const Fs   = require('fs');
const Os   = require('os');
const Path = require('path');

const HELPER = require('../helper.js');

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

/**
 * Create a temporary directory tree that looks like a minimal packages/ folder.
 * Returns the absolute path to the temp dir.
 */
function makeTempPackagesDir() {
  return Fs.mkdtempSync(Path.join(Os.tmpdir(), 'helper-test-'));
}

/**
 * Write all files needed for one minimal, non-React package.
 *
 * @param {string} packagesRoot - path returned by makeTempPackagesDir()
 * @param {string} name         - package folder name (scope-free, e.g. 'mock-btn')
 * @param {object} pkgOverride  - shallow-merge into the generated package.json
 *
 * NOTE: GetFolders() in helper.js always prepends 'core' to the returned list,
 * so every fixture root must contain a valid 'core' folder. Use
 * writeMinimalPackage(root, 'core', { name: '@truecms/core', ... }) or the
 * writeCorePackage() helper below.
 */
function writeMinimalPackage(packagesRoot, name, pkgOverride = {}) {
  const dir = Path.join(packagesRoot, name);
  Fs.mkdirSync(dir, { recursive: true });

  const version = pkgOverride.version || '1.0.0';
  const scopedName = pkgOverride.name || `@truecms/${name}`;

  const pkg = {
    name: scopedName,
    version,
    description: 'Fixture package',
    scripts: {
      'test:a11y': 'echo ok',
      'test:helper': 'echo ok',
      test: 'echo ok',
      prepublish: 'echo ok',
      'build:pre': 'echo ok',
      'build:js': 'echo ok',
      build: 'npm run build:js',
      serve: 'echo ok',
      'watch:js': 'echo ok',
      'watch:sass': 'echo ok',
      watch: 'echo ok',
    },
    dependencies: {},
    peerDependencies: {},
    devDependencies: {
      'browser-sync': '^3.0.4',
      'npm-run-all': '^4.1.5',
      onchange: '^7.1.0',
    },
    files: ['lib/*'],
    engines: { node: '>=22.0.0', npm: '>=10.0.0', pnpm: '>=9.0.0' },
    repository: { type: 'git', url: 'https://github.com/truecms/design-system-components.git' },
    license: 'MIT',
    ...pkgOverride,
  };

  Fs.writeFileSync(Path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));

  const vNoSuffix = version.split('-')[0];
  const vAnchor   = vNoSuffix.replace(/\./g, '');

  // Minimal CHANGELOG.md satisfying both the "## Versions" and "## Release History ### v" checks
  const changelog = [
    `# ${name}`,
    '',
    `## ${vNoSuffix}`,
    '',
    `Initial release.`,
    '',
    '## Versions',
    '',
    `- [v${vNoSuffix} - Initial release.](#v${vAnchor})`,
    '',
    '## Release History',
    '',
    `### v${vNoSuffix}`,
    '',
    `- Initial release.`,
    '',
  ].join('\n');

  Fs.writeFileSync(Path.join(dir, 'CHANGELOG.md'), changelog);

  // Minimal README.md satisfying the "## Release History\n\n* v" check
  const readme = [
    `# ${name}`,
    '',
    '## Release History',
    '',
    `* v${vNoSuffix}`,
    '',
  ].join('\n');

  Fs.writeFileSync(Path.join(dir, 'README.md'), readme);
}

/**
 * Write the mandatory 'core' package that GetFolders() always prepends.
 * The real core has a sass-versioning exception; this minimal version has
 * no deps at all so it passes without triggering any mismatch checks.
 */
function writeCorePackage(packagesRoot) {
  writeMinimalPackage(packagesRoot, 'core', {
    name: '@truecms/core',
    version: '6.0.0',
    dependencies: {},
    peerDependencies: {},
  });
}

/**
 * Add a react.js stub so the package is treated as a React module.
 */
function addReactSource(packagesRoot, name) {
  const jsDir = Path.join(packagesRoot, name, 'src', 'js');
  Fs.mkdirSync(jsDir, { recursive: true });
  Fs.writeFileSync(Path.join(jsDir, 'react.js'), '// stub\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('HELPER.test.init — valid fixture', () => {
  let packagesRoot;

  beforeEach(() => {
    packagesRoot = makeTempPackagesDir();
    // GetFolders() in helper.js always prepends 'core', so every fixture needs it.
    writeCorePackage(packagesRoot);
  });

  afterEach(() => {
    Fs.rmSync(packagesRoot, { recursive: true, force: true });
  });

  test('passes for a single minimal non-React package', () => {
    writeMinimalPackage(packagesRoot, 'mock-btn');
    expect(() => HELPER.test.init(packagesRoot)).not.toThrow();
  });

  test('passes for a valid React package with matching scripts and devDependencies', () => {
    const name = 'mock-widget';
    writeMinimalPackage(packagesRoot, name, {
      main: 'lib/js/react.es5.js',
      scripts: {
        'test:a11y': 'echo ok',
        'test:helper': 'echo ok',
        test: 'echo ok',
        prepublish: 'echo ok',
        'build:pre': 'echo ok',
        'build:js': 'echo ok',
        'build:react': 'cd tests/react && webpack',
        build: 'npm run build:js && npm run build:react',
        serve: 'echo ok',
        'watch:js': 'echo ok',
        'watch:jsx': 'echo ok',
        'watch:sass': 'echo ok',
        watch: 'echo ok',
      },
      devDependencies: {
        'browser-sync':    '^3.0.4',
        'npm-run-all':     '^4.1.5',
        onchange:          '^7.1.0',
        react:             '^19.0.0',
        'react-dom':       '^19.0.0',
        webpack:           '^5.0.0',
        'webpack-cli':     '^6.0.0',
        '@babel/core':     '^7.0.0',
        '@babel/preset-env': '^7.0.0',
        '@babel/preset-react': '^7.0.0',
        'babel-loader':    '^10.0.0',
      },
    });
    addReactSource(packagesRoot, name);
    expect(() => HELPER.test.init(packagesRoot)).not.toThrow();
  });

  test('passes for two sibling packages where peerDependency versions satisfy', () => {
    // pkg-b depends on pkg-a@^1.0.0 and pkg-a is at 1.0.0
    // core is already written in beforeEach
    writeMinimalPackage(packagesRoot, 'pkg-a', {
      name: '@truecms/pkg-a',
      version: '1.0.0',
    });
    writeMinimalPackage(packagesRoot, 'pkg-b', {
      name: '@truecms/pkg-b',
      version: '1.0.0',
      dependencies:     { '@truecms/pkg-a': 'workspace:*' },
      peerDependencies: { '@truecms/pkg-a': '^1.0.0' },
    });
    expect(() => HELPER.test.init(packagesRoot)).not.toThrow();
  });
});

describe('HELPER.test.init — broken fixtures', () => {
  let packagesRoot;

  beforeEach(() => {
    packagesRoot = makeTempPackagesDir();
    writeCorePackage(packagesRoot);
  });

  afterEach(() => {
    Fs.rmSync(packagesRoot, { recursive: true, force: true });
  });

  test('throws when a React module is missing the "main" field', () => {
    const name = 'bad-react';
    writeMinimalPackage(packagesRoot, name, {
      // no main field
      scripts: {
        'test:a11y': 'echo ok',
        'test:helper': 'echo ok',
        test: 'echo ok',
        prepublish: 'echo ok',
        'build:pre': 'echo ok',
        'build:js': 'echo ok',
        'build:react': 'cd tests/react && webpack',
        build: 'npm run build:js && npm run build:react',
        serve: 'echo ok',
        'watch:js': 'echo ok',
        'watch:jsx': 'echo ok',
        'watch:sass': 'echo ok',
        watch: 'echo ok',
      },
      devDependencies: {
        'browser-sync':    '^3.0.4',
        'npm-run-all':     '^4.1.5',
        onchange:          '^7.1.0',
        react:             '^19.0.0',
        'react-dom':       '^19.0.0',
        webpack:           '^5.0.0',
        'webpack-cli':     '^6.0.0',
        '@babel/core':     '^7.0.0',
        '@babel/preset-env': '^7.0.0',
        '@babel/preset-react': '^7.0.0',
        'babel-loader':    '^10.0.0',
      },
    });
    addReactSource(packagesRoot, name);
    expect(() => HELPER.test.init(packagesRoot)).toThrow();
  });

  test('throws when dependencies and peerDependencies do not match', () => {
    writeMinimalPackage(packagesRoot, 'bad-deps', {
      name: '@truecms/bad-deps',
      version: '1.0.0',
      // dependencies has two entries but peerDependencies only has one
      dependencies:     { '@truecms/core': 'workspace:*', '@truecms/animate': 'workspace:*' },
      peerDependencies: { '@truecms/core': '^6.0.0' },
    });
    expect(() => HELPER.test.init(packagesRoot)).toThrow();
  });

  test('throws when legacy pancake config block is present', () => {
    writeMinimalPackage(packagesRoot, 'bad-pancake', {
      pancake: { 'pancake-module': { category: 'layout' } },
    });
    expect(() => HELPER.test.init(packagesRoot)).toThrow();
  });

  test('throws when peerDependency version does not satisfy sibling package version', () => {
    // pkg-a is at 2.0.0 but pkg-b declares peerDep ^1.0.0 — should fail
    writeMinimalPackage(packagesRoot, 'pkg-a', {
      name: '@truecms/pkg-a',
      version: '2.0.0',
    });
    writeMinimalPackage(packagesRoot, 'pkg-b', {
      name: '@truecms/pkg-b',
      version: '1.0.0',
      dependencies:     { '@truecms/pkg-a': 'workspace:*' },
      peerDependencies: { '@truecms/pkg-a': '^1.0.0' },
    });
    expect(() => HELPER.test.init(packagesRoot)).toThrow();
  });
});
