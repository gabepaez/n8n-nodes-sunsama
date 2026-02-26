import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function run(command, args, options = {}) {
	return execFileSync(command, args, {
		encoding: 'utf8',
		stdio: 'pipe',
		...options,
	});
}

function parseArgs() {
	const args = process.argv.slice(2);
	let tag;

	for (const arg of args) {
		if (arg.startsWith('--tag=')) {
			tag = arg.split('=', 2)[1];
			continue;
		}

		if (!arg.startsWith('--') && !tag) {
			tag = arg;
		}
	}

	return { tag };
}

function isValidTag(tag) {
	return /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag);
}

function getChangelogSection(changelogContent, version) {
	const lines = changelogContent.split('\n');
	const startHeader = `## [${version}]`;

	const startIndex = lines.findIndex((line) => line.startsWith(startHeader));
	if (startIndex === -1) {
		return `### Notes\n- Release ${version}`;
	}

	let endIndex = lines.length;
	for (let i = startIndex + 1; i < lines.length; i++) {
		if (lines[i].startsWith('## [')) {
			endIndex = i;
			break;
		}
	}

	const section = lines.slice(startIndex + 1, endIndex).join('\n').trim();
	return section || `### Notes\n- Release ${version}`;
}

function main() {
	run('gh', ['--version']);

	const { tag: rawTag } = parseArgs();

	const packageJsonPath = resolve('package.json');
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
	const packageVersion = String(packageJson.version ?? '').trim();

	if (!packageVersion) {
		throw new Error('Could not determine package version from package.json');
	}

	const tag = rawTag || `v${packageVersion}`;
	if (!isValidTag(tag)) {
		throw new Error(
			`Invalid tag "${tag}". Expected format like v1.2.3 or v1.2.3-beta.1`,
		);
	}

	const version = tag.replace(/^v/, '');

	run('git', ['rev-parse', '--verify', tag]);

	try {
		run('gh', ['release', 'view', tag]);
		console.log(`Release ${tag} already exists. Skipping.`);
		return;
	} catch {
		// Release does not exist. Continue.
	}

	const changelogPath = resolve('CHANGELOG.md');
	const templatePath = resolve('.github/release-template.md');
	const notesPath = resolve('.github/.release-notes.tmp.md');

	const changelogContent = readFileSync(changelogPath, 'utf8');
	const template = readFileSync(templatePath, 'utf8');
	const changelogSection = getChangelogSection(changelogContent, version);

	const notes = template
		.replaceAll('{{TAG}}', tag)
		.replaceAll('{{VERSION}}', version)
		.replace('{{CHANGELOG_SECTION}}', changelogSection);

	writeFileSync(notesPath, notes, 'utf8');

	try {
		execFileSync(
			'gh',
			['release', 'create', tag, '--title', tag, '--notes-file', notesPath],
			{ stdio: 'inherit' },
		);
	} finally {
		rmSync(notesPath, { force: true });
	}
}

try {
	main();
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exit(1);
}
