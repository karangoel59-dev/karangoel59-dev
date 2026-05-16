import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { refreshTasks } from '$lib/server/tasks';

function processContent(originalContent: string) {
	const fmMatch = originalContent.match(/^---\n([\s\S]*?)\n---/);
	if (!fmMatch) {
		throw new Error('Missing or invalid YAML frontmatter');
	}

	const frontmatterStr = fmMatch[1];
	const body = originalContent.slice(fmMatch[0].length);

	const parsed: Record<string, string> = {};
	const lines = frontmatterStr.split('\n');
	for (const line of lines) {
		const colonIdx = line.indexOf(':');
		if (colonIdx !== -1) {
			const key = line.slice(0, colonIdx).trim().toLowerCase();
			let value = line.slice(colonIdx + 1).trim();
			// strip surrounding quotes if any
			if (
				(value.startsWith("'") && value.endsWith("'")) ||
				(value.startsWith('"') && value.endsWith('"'))
			) {
				value = value.slice(1, -1);
			}
			parsed[key] = value;
		}
	}

	const task = parsed['task'];
	const date = parsed['date'];

	if (!task) throw new Error('Missing mandatory field: Task');
	if (!date) throw new Error('Missing mandatory field: Date');

	const link = parsed['link'] || '';
	const taskType = parsed['task type'] || '';
	const status = parsed['status'] || 'No';

	// standard yaml format
	const newFrontmatter = [
		'---',
		`Task: '${task.replace(/'/g, "\\'")}'`,
		`Date: '${date.replace(/'/g, "\\'")}'`,
		`LINK: '${link.replace(/'/g, "\\'")}'`,
		`Task Type: '${taskType.replace(/'/g, "\\'")}'`,
		`Status: '${status.replace(/'/g, "\\'")}'`,
		'---'
	].join('\n');

	// Clean up body (remove leading blank lines)
	let cleanedBody = body;
	while (cleanedBody.startsWith('\n')) {
		cleanedBody = cleanedBody.slice(1);
	}

	return `${newFrontmatter}\n${cleanedBody}`;
}

export async function POST({ request }) {
	try {
		const formData = await request.formData();
		const files = formData.getAll('files') as File[];

		if (!files || files.length === 0) {
			return json({ error: 'No files uploaded' }, { status: 400 });
		}

		const uploadsDir = path.resolve('data/uploads');

		// Validate all files first
		const processedFiles: { name: string; content: string }[] = [];
		const errors: string[] = [];

		for (const file of files) {
			if (!file.name.endsWith('.md')) continue;

			const rawText = await file.text();
			const sanitizedName = path.basename(file.webkitRelativePath || file.name);

			try {
				const processedContent = processContent(rawText);
				processedFiles.push({ name: sanitizedName, content: processedContent });
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				errors.push(`${file.name}: ${msg}`);
			}
		}

		if (errors.length > 0) {
			return json(
				{ error: 'Invalid files detected. Please ensure standard YAML format.', details: errors },
				{ status: 400 }
			);
		}

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

		for (const file of processedFiles) {
			fs.writeFileSync(path.join(uploadsDir, file.name), file.content, 'utf-8');
		}

		// Force MarkdownDB to re-index the newly added files
		await refreshTasks();

		return json({ success: true, count: processedFiles.length });
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to process upload' }, { status: 500 });
	}
}
