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
	const taskType = parsed['task type'] || '';

	if (!task) throw new Error('Missing mandatory field: Task');
	if (
		!date &&
		task.toLowerCase() !== 'things to note' &&
		task.toLowerCase() !== 'quick links' &&
		taskType.toLowerCase() !== 'quick links'
	)
		throw new Error('Missing mandatory field: Date');

	const link = parsed['link'] || '';
	const status = parsed['status'] || 'No';

	// standard yaml format
	const newFrontmatter = [
		'---',
		`Task: '${task.replace(/'/g, "\\'")}'`,
		`Date: '${(date || '').replace(/'/g, "\\'")}'`,
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
		const imageFiles: { name: string; buffer: Buffer }[] = [];
		const docFiles: { name: string; content: string }[] = [];
		const errors: string[] = [];

		for (const file of files) {
			// In SvelteKit, file.name usually contains the relative path for folder uploads
			const fullPath = file.name;
			const normalizedPath = fullPath.replace(/\\/g, '/');
			const pathParts = normalizedPath.split('/').filter(Boolean);

			// Skip hidden files or files in hidden directories
			if (pathParts.some((part) => part.startsWith('.'))) {
				continue;
			}

			const isMarkdown = fullPath.toLowerCase().endsWith('.md');
			const isImage = /\.(png|jpe?g|gif|svg|webp)$/i.test(fullPath);
			const isDoc = /\.(docx?|pdf|txt)$/i.test(fullPath);

			if (!isMarkdown && !isImage && !isDoc) continue;

			if (isMarkdown) {
				const rawText = await file.text();
				const sanitizedName = path.basename(normalizedPath);

				try {
					const processedContent = processContent(rawText);
					processedFiles.push({ name: sanitizedName, content: processedContent });
				} catch (err) {
					const msg = err instanceof Error ? err.message : String(err);
					errors.push(`${file.name}: ${msg}`);
				}
			} else if (isImage) {
				try {
					let relativePath = normalizedPath;
					
					// If "images" is in the path, keep it and everything after it
					const imagesIdx = pathParts.indexOf('images');
					if (imagesIdx !== -1) {
						relativePath = pathParts.slice(imagesIdx).join('/');
					} else if (pathParts.length > 1) {
						// Otherwise strip the root folder name if it exists
						relativePath = pathParts.slice(1).join('/');
					}

					const arrayBuffer = await file.arrayBuffer();
					imageFiles.push({
						name: relativePath,
						buffer: Buffer.from(arrayBuffer)
					});
				} catch (err) {
					errors.push(`${file.name}: Failed to read image data`);
				}
			} else if (isDoc) {
				try {
					let relativePath = normalizedPath;

					// If "docs" is in the path, keep it and everything after it
					const docsIdx = pathParts.indexOf('docs');
					if (docsIdx !== -1) {
						relativePath = pathParts.slice(docsIdx).join('/');
					} else if (pathParts.length > 1) {
						// Otherwise strip the root folder name if it exists
						relativePath = pathParts.slice(1).join('/');
					}
					
					const arrayBuffer = await file.arrayBuffer();
					docFiles.push({
						name: relativePath,
						content: Buffer.from(arrayBuffer).toString('base64')
					});
				} catch (err) {
					errors.push(`${file.name}: Failed to read document data`);
				}
			}
		}

		// Create directory if it doesn't exist
		if (!fs.existsSync(uploadsDir)) {
			fs.mkdirSync(uploadsDir, { recursive: true });
		}

		for (const file of processedFiles) {
			fs.writeFileSync(path.join(uploadsDir, file.name), file.content, 'utf-8');
		}

		// Write Image files (maintaining subdirectories)
		for (const file of imageFiles) {
			const targetPath = path.join(uploadsDir, file.name);
			const targetDir = path.dirname(targetPath);
			if (!fs.existsSync(targetDir)) {
				fs.mkdirSync(targetDir, { recursive: true });
			}
			fs.writeFileSync(targetPath, file.buffer);
		}

		// Write Document files (maintaining subdirectories)
		for (const file of docFiles) {
			const targetPath = path.join(uploadsDir, file.name);
			const targetDir = path.dirname(targetPath);
			if (!fs.existsSync(targetDir)) {
				fs.mkdirSync(targetDir, { recursive: true });
			}
			fs.writeFileSync(targetPath, Buffer.from(file.content, 'base64'));
		}

		if (processedFiles.length > 0 || imageFiles.length > 0 || docFiles.length > 0) {
			// Force MarkdownDB to re-index the newly added files
			await refreshTasks();
		}

		return json({
			success: true,
			count: processedFiles.length + imageFiles.length,
			skipped: errors.length,
			details: errors.length > 0 ? errors : undefined
		});
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to process upload' }, { status: 500 });
	}
}

