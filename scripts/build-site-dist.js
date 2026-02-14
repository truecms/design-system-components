'use strict';

const Fs = require('fs');
const Path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const SITE_DIST = Path.join(ROOT, 'site-dist');
const PACKAGES_DIR = Path.join(ROOT, 'packages');
const INCLUDED_DIRS = ['lib', 'tests'];
const TEMPLATE_INDEX = Path.join(ROOT, '.templates', 'index', 'index.html');
const BUILT_PACKAGES = new Set();

const readPackageBuildScript = (packagePath) => {
	const packageJsonPath = Path.join(packagePath, 'package.json');
	if (!Fs.existsSync(packageJsonPath)) {
		return null;
	}

	try {
		const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, 'utf8'));
		return packageJson && packageJson.scripts ? packageJson.scripts.build : null;
	} catch {
		return null;
	}
};

const packageNeedsSiteArtifacts = (packagePath) => {
	const siteTestsPath = Path.join(packagePath, 'tests', 'site');
	if (!Fs.existsSync(siteTestsPath)) {
		return false;
	}

	const hasTestScss = Fs.existsSync(Path.join(siteTestsPath, 'test.scss'));
	const hasModuleJs = Fs.existsSync(Path.join(packagePath, 'src', 'js', 'module.js'));
	if (!hasTestScss && !hasModuleJs) {
		return false;
	}

	const hasStyle = Fs.existsSync(Path.join(siteTestsPath, 'style.css'));
	const hasScript = Fs.existsSync(Path.join(siteTestsPath, 'script.js'));
	const needsStyle = hasTestScss && !hasStyle;
	const needsScript = hasModuleJs && !hasScript;
	return needsStyle || needsScript;
};

const ensurePackageArtifacts = (packageName, packagePath) => {
	if (BUILT_PACKAGES.has(packageName)) {
		return;
	}

	if (!packageNeedsSiteArtifacts(packagePath)) {
		return;
	}

	const buildScript = readPackageBuildScript(packagePath);
	if (!buildScript) {
		return;
	}

	console.log(
		`[site-dist] Missing generated tests/site assets for ${packageName}; running package build.`
	);
	execSync(`pnpm --filter "./packages/${packageName}" run build`, {
		cwd: ROOT,
		stdio: 'inherit',
	});
	BUILT_PACKAGES.add(packageName);
};

const getPackageEntries = () => {
	const dirents = Fs.existsSync(PACKAGES_DIR)
		? Fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })
		: [];

	return dirents
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
		.sort();
};

const buildDefaultIndex = () => {
	const packageEntries = getPackageEntries();
	const moduleLinks = packageEntries
		.map((moduleName) => {
			return [
				`\t\t<li><span class="module-list__headline">${moduleName}</span>`,
				`\t\t\t<div>`,
				`\t\t\t\t<a class="link" href="packages/${moduleName}/tests/">tests</a>`,
				`\t\t\t</div>`,
				`\t\t</li>`,
			].join('\n');
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

const copyPackageDirectory = (packageDirent) => {
	const packageName = packageDirent.name;
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

	const indexHtml = Path.join(ROOT, 'index.html');
	if (Fs.existsSync(indexHtml)) {
		Fs.copyFileSync(indexHtml, Path.join(SITE_DIST, 'index.html'));
	} else {
		Fs.writeFileSync(Path.join(SITE_DIST, 'index.html'), buildDefaultIndex(), 'utf8');
	}

	if (!Fs.existsSync(PACKAGES_DIR)) {
		console.warn('No packages directory found, skipping package copy.');
		return;
	}

	const packageDirents = Fs.readdirSync(PACKAGES_DIR, { withFileTypes: true });
	for (const dirent of packageDirents) {
		if (!dirent.isDirectory()) {
			continue;
		}

		copyPackageDirectory(dirent);
	}
};

try {
	buildSiteDist();
} catch (error) {
	console.error('Failed to build site-dist:', error);
	process.exitCode = 1;
}
