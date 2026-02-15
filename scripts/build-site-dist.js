'use strict';

const Fs = require('fs');
const Path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const SITE_DIST = Path.join(ROOT, 'site-dist');
const PACKAGES_DIR = Path.join(ROOT, 'packages');
const INCLUDED_DIRS = ['lib', 'tests'];
const TEMPLATE_INDEX = Path.join(ROOT, '.templates', 'index', 'index.html');
const PACKAGE_SCOPE = '@truecms';
const README_BASE_URL = 'https://github.com/truecms/design-system-components/blob/master/packages';
const BUILT_PACKAGES = new Set();

const readPackageMetadata = (packagePath) => {
	const packageJsonPath = Path.join(packagePath, 'package.json');
	if (!Fs.existsSync(packageJsonPath)) {
		return { name: null, scripts: {} };
	}

	try {
		const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, 'utf8'));
		return {
			name: packageJson && packageJson.name ? packageJson.name : null,
			scripts: packageJson && packageJson.scripts ? packageJson.scripts : {},
		};
	} catch {
		return { name: null, scripts: {} };
	}
};

const getMissingArtifacts = (packagePath) => {
	const missing = {
		siteStyle: false,
		siteScript: false,
		reactBundle: false,
	};

	const siteTestsPath = Path.join(packagePath, 'tests', 'site');
	if (Fs.existsSync(siteTestsPath)) {
		const hasTestScss = Fs.existsSync(Path.join(siteTestsPath, 'test.scss'));
		const siteIndexPath = Path.join(siteTestsPath, 'index.html');
		const siteIndex = Fs.existsSync(siteIndexPath)
			? Fs.readFileSync(siteIndexPath, 'utf8')
			: '';
		const expectsSiteScript = /src=["']script\.js["']/.test(siteIndex);

		if (hasTestScss && !Fs.existsSync(Path.join(siteTestsPath, 'style.css'))) {
			missing.siteStyle = true;
		}

		if (expectsSiteScript && !Fs.existsSync(Path.join(siteTestsPath, 'script.js'))) {
			missing.siteScript = true;
		}
	}

	const reactTestsPath = Path.join(packagePath, 'tests', 'react');
	if (Fs.existsSync(reactTestsPath)) {
		const reactIndexPath = Path.join(reactTestsPath, 'index.html');
		const reactIndex = Fs.existsSync(reactIndexPath)
			? Fs.readFileSync(reactIndexPath, 'utf8')
			: '';
		const expectsReactBundle = /src=["']bundle\.js["']/.test(reactIndex);

		if (expectsReactBundle && !Fs.existsSync(Path.join(reactTestsPath, 'bundle.js'))) {
			missing.reactBundle = true;
		}
	}

	return missing;
};

const pickBuildScripts = (scripts, { needsReact = false } = {}) => {
	const hasBuildJs = Boolean(scripts['build:js']);
	const hasBuildPre = Boolean(scripts['build:pre']);
	const hasBuildReact = Boolean(scripts['build:react']);
	const hasBuild = Boolean(scripts.build);
	const buildJsIncludesPrecompile = hasBuildJs && /build:pre/.test(scripts['build:js']);

	if (needsReact) {
		if (hasBuild) {
			return ['build'];
		}

		const scriptsToRun = [];
		if (hasBuildPre) {
			scriptsToRun.push('build:pre');
		}
		if (hasBuildJs) {
			scriptsToRun.push('build:js');
		}
		if (hasBuildReact) {
			scriptsToRun.push('build:react');
		}
		return scriptsToRun;
	}

	if (buildJsIncludesPrecompile) {
		return ['build:js'];
	}

	if (hasBuildPre && hasBuildJs) {
		return ['build:pre', 'build:js'];
	}

	if (hasBuild) {
		return ['build'];
	}

	if (hasBuildJs) {
		return ['build:js'];
	}

	return [];
};

const ensurePackageArtifacts = (packageName, packagePath) => {
	if (BUILT_PACKAGES.has(packageName)) {
		return;
	}

	const missingArtifacts = getMissingArtifacts(packagePath);
	const needsBuild = missingArtifacts.siteStyle || missingArtifacts.siteScript || missingArtifacts.reactBundle;
	if (!needsBuild) {
		return;
	}

	const metadata = readPackageMetadata(packagePath);
	const scripts = metadata.scripts;
	const scriptsToRun = pickBuildScripts(scripts, {
		needsReact: missingArtifacts.reactBundle,
	});
	if (scriptsToRun.length === 0) {
		return;
	}

	const missingKeys = Object.entries(missingArtifacts)
		.filter(([, isMissing]) => isMissing)
		.map(([key]) => key)
		.join(', ');

	console.log(
		`[site-dist] Missing generated test assets for ${packageName} (${missingKeys}); running package ${scriptsToRun.join(', ')}.`
	);
	const filterTarget = metadata.name || `./packages/${packageName}`;
	// Include workspace dependencies in the build filter so generated test bundles
	// can inline dependency JS (for example accordion -> animate).
	for (const scriptToRun of scriptsToRun) {
		execSync(`pnpm --filter "${filterTarget}..." run ${scriptToRun}`, {
			cwd: ROOT,
			stdio: 'inherit',
		});
	}
	BUILT_PACKAGES.add(packageName);
};

const getPackageEntries = () => {
	const dirents = Fs.existsSync(PACKAGES_DIR)
		? Fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
		: [];

	const packageNames = dirents
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	const withoutCore = packageNames.filter((name) => name !== 'core');
	return packageNames.includes('core') ? ['core', ...withoutCore] : withoutCore;
};

const hasTestVariant = (packagePath, variant) => {
	const variantPath = Path.join(packagePath, 'tests', variant);
	return Fs.existsSync(variantPath) && Fs.statSync(variantPath).isDirectory();
};

const buildDefaultIndex = () => {
	const packageEntries = getPackageEntries();
	const moduleLinks = packageEntries
		.map((moduleName) => {
			const packagePath = Path.join(PACKAGES_DIR, moduleName);
			const hasJquery = hasTestVariant(packagePath, 'jquery');
			const hasReact = hasTestVariant(packagePath, 'react');
			const jqueryLink = hasJquery ? `<a class="link" href="packages/${moduleName}/tests/jquery/">jquery</a>` : '';
			const reactLink = hasReact ? `<a class="link" href="packages/${moduleName}/tests/react/">react</a>` : '';

			return `<li>` +
				`\t<a class="module-list__headline" href="packages/${moduleName}/tests/">${moduleName}</a>` +
				`<img class="badge badge--version" src="https://img.shields.io/npm/v/${PACKAGE_SCOPE}/${moduleName}.svg?label=NPM%20&colorA=ffffff&colorB=00698f&style=flat-square" alt="${moduleName} version">` +
				`\t<br>` +
				`\t<a class="link" href="packages/${moduleName}/tests/site/">site</a> ${jqueryLink} ${reactLink}` +
				`\t<a class="link" href="${README_BASE_URL}/${moduleName}/README.md">readme</a>` +
				`</li>`;
		})
		.join('\n');

	let indexTemplate = null;

	if (Fs.existsSync(TEMPLATE_INDEX)) {
		indexTemplate = Fs.readFileSync(TEMPLATE_INDEX, 'utf8');
	}

	if (indexTemplate !== null) {
		return indexTemplate.replace('[-auds-modules-]', moduleLinks);
	}

	return [
		'<!doctype html>',
		'<html lang="en">',
		'<head>',
		'\t<meta charset="utf-8">',
		'\t<meta name="viewport" content="width=device-width, initial-scale=1">',
		'\t<title>Design System Components</title>',
		'</head>',
		'<body>',
		'\t<h1>All component tests</h1>',
		'\t<ul>',
		`\t\t${moduleLinks}`,
		'\t</ul>',
		'</body>',
		'</html>',
	].join('\n');
};

const copyPackageDirectory = (packageName) => {
	const packagePath = Path.join(PACKAGES_DIR, packageName);
	const destinationPath = Path.join(SITE_DIST, 'packages', packageName);
	ensurePackageArtifacts(packageName, packagePath);

	for (const includedDir of INCLUDED_DIRS) {
		const sourceDir = Path.join(packagePath, includedDir);
		if (!Fs.existsSync(sourceDir)) {
			continue;
		}

		const targetDir = Path.join(destinationPath, includedDir);
		Fs.mkdirSync(Path.dirname(targetDir), { recursive: true });
		Fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
	}
};

const buildSiteDist = () => {
	Fs.rmSync(SITE_DIST, { recursive: true, force: true });
	Fs.mkdirSync(SITE_DIST, { recursive: true });

	// Always build a fresh index for site-dist so links reflect the
	// generated artefacts currently available in each package.
	Fs.writeFileSync(Path.join(SITE_DIST, 'index.html'), buildDefaultIndex(), 'utf8');

	if (!Fs.existsSync(PACKAGES_DIR)) {
		console.warn('No packages directory found, skipping package copy.');
		return;
	}

	const packageEntries = getPackageEntries();
	for (const packageName of packageEntries) {
		copyPackageDirectory(packageName);
	}
};

try {
	buildSiteDist();
} catch (error) {
	console.error('Failed to build site-dist:', error);
	process.exitCode = 1;
}
