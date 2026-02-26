import { cp, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const filesToCopy = [
	{
		from: resolve('nodes/Sunsama/sunsama.svg'),
		to: resolve('dist/nodes/Sunsama/sunsama.svg'),
	},
];

for (const file of filesToCopy) {
	await mkdir(dirname(file.to), { recursive: true });
	await cp(file.from, file.to);
}

console.log(`Copied ${filesToCopy.length} static asset(s).`);
