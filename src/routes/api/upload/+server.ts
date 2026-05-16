import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { refreshTasks } from '$lib/server/tasks';

function processContent(originalContent: string, defaultTaskName: string) {
	let content = originalContent;
	let frontmatter = '';
	let body = content;

	const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
	if (fmMatch) {
		frontmatter = fmMatch[1].trim();
		body = content.slice(fmMatch[0].length);
	} else {
		// Extract from body if no frontmatter
		const lines = content.split('\n');
		let taskName = '';
		let date = '';
		let link = '';
		let taskType = '';

		for (let i = 0; i < Math.min(lines.length, 20); i++) {
			const line = lines[i].trim();
			if (line.startsWith('# ')) {
				if (!taskName) taskName = line.replace(/^#\s*/, '').trim();
			} else if (line.startsWith('Date:')) {
				date = line.replace(/^Date:\s*/, '').trim();
			} else if (line.startsWith('LINK:')) {
				link = line.replace(/^LINK:\s*/, '').trim();
			} else if (line.startsWith('Task Type:')) {
				taskType = line.replace(/^Task Type:\s*/, '').trim();
			}
		}

		if (!taskName) {
			taskName = defaultTaskName;
		}

		frontmatter = [
			`Task: "${taskName.replace(/"/g, '\\"')}"`,
			date ? `Date: "${date}"` : '',
			link ? `LINK: "${link}"` : '',
			taskType ? `Task Type: "${taskType}"` : ''
		]
			.filter(Boolean)
			.join('\n');
	}

	// Clean up body and extract status
	let status = '';
	const bodyLines = body.split('\n');
	const cleanedLines = [];

	for (let i = 0; i < bodyLines.length; i++) {
		const line = bodyLines[i];

		if (i < 30) {
			if (/^:\s*(Yes|No|yes|no)/i.test(line)) {
				status = line.replace(/^:\s*/, '').trim();
				continue;
			}
			if (!fmMatch) {
				// Strip metadata text if we just generated frontmatter
				if (/^Date:/i.test(line)) continue;
				if (/^LINK:/i.test(line)) continue;
				if (/^Task Type:/i.test(line)) continue;
			}
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
			break;
		}
		cleanedLines.shift();
	}

	if (status && !frontmatter.includes('Status:')) {
		frontmatter += `\nStatus: "${status}"`;
	}

	return `---\n${frontmatter}\n---\n${cleanedLines.join('\n')}`;
}

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const files = formData.getAll('files') as File[];

		if (!files || files.length === 0) {
			return json({ error: 'No files uploaded' }, { status: 400 });
		}

		const uploadsDir = path.resolve('data/uploads');

		// Create directory if it doesn't exist
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		} else {
			// Clear existing uploads to reset the state
			const existingFiles = fs.readdirSync(uploadsDir);
			for (const file of existingFiles) {
				fs.unlinkSync(path.join(uploadsDir, file));
			}
		}

		let savedCount = 0;
		for (const file of files) {
			if (!file.name.endsWith('.md')) continue;

			const rawText = await file.text();
			const sanitizedName = path.basename(file.webkitRelativePath || file.name);
			const defaultTaskName = sanitizedName
				.replace(/\.md$/, '')
				.replace(/ [a-f0-9]{32}$/, '')
				.trim();

			const processedContent = processContent(rawText, defaultTaskName);

			fs.writeFileSync(path.join(uploadsDir, sanitizedName), processedContent, 'utf-8');
			savedCount++;
		}

		// Force MarkdownDB to re-index the newly added files
		await refreshTasks();

		return json({ success: true, count: savedCount });
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to process upload' }, { status: 500 });
	}
}
