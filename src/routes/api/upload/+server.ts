import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { refreshTasks } from '$lib/server/tasks';
import yaml from 'js-yaml';

function processContent(originalContent: string) {
	const fmMatch = originalContent.match(/^---\n([\s\S]*?)\n---/);
	if (!fmMatch) {
		throw new Error('Missing or invalid YAML frontmatter');
	}

	const frontmatterStr = fmMatch[1];
	const body = originalContent.slice(fmMatch[0].length);

	let parsed: any;
	try {
		parsed = yaml.load(frontmatterStr);
	} catch (e) {
		throw new Error('Invalid YAML syntax in frontmatter');
	}

	const task = parsed.Task || parsed.task;
	const from = parsed.From || parsed.from;
	const to = parsed.To || parsed.to;
	const taskType = parsed['Task Type'] || parsed['task type'] || [];
	const link = parsed.LINK || parsed.link || '';
	const status =
		parsed.Status !== undefined
			? parsed.Status
			: parsed.status !== undefined
				? parsed.status
				: false;

	if (!task) throw new Error('Missing mandatory field: Task');

	const isQuickLinks =
		task.toLowerCase() === 'quick links' ||
		(Array.isArray(taskType)
			? taskType.some((t) => t.toLowerCase() === 'quick links')
			: taskType.toLowerCase() === 'quick links');

	if (!from && task.toLowerCase() !== 'things to note' && !isQuickLinks)
		throw new Error('Missing mandatory field: From');

	const cleanMetadata = {
		Task: task,
		From: from || '',
		To: to || '',
		LINK: link,
		'Task Type': Array.isArray(taskType) ? taskType : [taskType].filter(Boolean),
		Status: status === true || String(status).toLowerCase() === 'true'
	};

	const newFrontmatter = `---\n${yaml.dump(cleanMetadata, { quotingType: "'" }).trim()}\n---`;

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
