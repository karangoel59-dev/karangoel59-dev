import fs from 'fs';
import path from 'path';

function cleanFile(filePath) {
	let content = fs.readFileSync(filePath, 'utf-8');

	// Find frontmatter
	const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
	if (!fmMatch) {
		console.log(`No frontmatter found in ${filePath}`);
		return;
	}

	let frontmatter = fmMatch[1];
	let body = content.slice(fmMatch[0].length);

	let status = '';

	const bodyLines = body.split('\n');
	const cleanedLines = [];

	let inHeaderSection = true;

	for (let i = 0; i < bodyLines.length; i++) {
		const line = bodyLines[i];

		// Once we pass the initial metadata lines, we can stop aggressively removing things,
		// though global removal might be safer for these specific prefixes.
		// Let's just check everywhere or top 30 lines.

		if (i < 30) {
			if (/^:\s*(Yes|No|yes|no)/i.test(line)) {
				status = line.replace(/^:\s*/, '').trim();
				continue; // skip line
			}
			if (/^Date:/i.test(line)) continue;
			if (/^LINK:/i.test(line)) continue;
			if (/^Task Type:/i.test(line)) continue;
		}

		cleanedLines.push(line);
	}

	// Clean up multiple leading empty lines
	while (
		cleanedLines.length > 0 &&
		cleanedLines[0].trim() === '' &&
		!cleanedLines[0].startsWith('#')
	) {
		if (cleanedLines.length > 1 && cleanedLines[1].startsWith('#')) {
			break; // keep one newline before header if it's there
		}
		cleanedLines.shift();
	}

	// Update frontmatter with Status if found
	if (status) {
		if (!frontmatter.includes('Status:')) {
			frontmatter += `\nStatus: "${status}"`;
		}
	}

	const newContent = `---
${frontmatter}
---
${cleanedLines.join('\n')}`;

	fs.writeFileSync(filePath, newContent);
	console.log(`Cleaned ${path.basename(filePath)}`);
}

function processDir(dir) {
	if (!fs.existsSync(dir)) return;
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		if (fs.statSync(fullPath).isDirectory()) {
			// processDir(fullPath); // Don't recurse unless necessary, the previous script didn't.
		} else if (file.endsWith('.md')) {
			cleanFile(fullPath);
		}
	}
}

processDir('ref/Work Dashboard/To Do List/To Do List');
processDir('data/uploads');
