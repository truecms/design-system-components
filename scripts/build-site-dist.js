'use strict';

const Fs = require('fs');
const Path = require('path');

const ROOT = process.cwd();
const SITE_DIST = Path.join(ROOT, 'site-dist');
const PACKAGES_DIR = Path.join(ROOT, 'packages');
const INCLUDED_DIRS = ['lib', 'tests'];

const copyPackageDirectory = (packageDirent) => {
	const packageName = packageDirent.name;
	const packagePath = Path.join(PACKAGES_DIR, packageName);
	const destinationPath = Path.join(SITE_DIST, 'packages', packageName);

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
