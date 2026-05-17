// src/routes/task/[...file].[ext]/+server.ts
import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

const mimeTypes: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml',
	pdf: 'application/pdf',
	txt: 'text/plain',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

// Create a helper to sort extensions into folders
const getSubfolder = (ext: string): string => {
	const docTypes = ['pdf', 'txt', 'doc', 'docx'];
	const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

	if (docTypes.includes(ext)) return 'docs';
	if (imageTypes.includes(ext)) return 'images'; // or whatever your image folder is named
	
	return ''; // Default to root if it doesn't match
};

export const GET: RequestHandler = async ({ params }) => {
	const { file, ext } = params;
	const normalizedExt = ext.toLowerCase();

	if (!(normalizedExt in mimeTypes)) {
		throw error(404, 'Not a valid file type');
	}

	// 1. Automatically determine the subfolder based on the extension
	const subfolder = getSubfolder(normalizedExt);

	// 2. Resolve the target directory to include the smart subfolder
	// Example: Resolves to "data/uploads/docs" or "data/uploads/images"
	const baseDir = path.resolve('data/uploads', subfolder);
	
	const filePath = path.resolve(baseDir, `${file}.${normalizedExt}`);

	if (!filePath.startsWith(baseDir + path.sep)) {
		throw error(403, 'Forbidden path');
	}

	try {
		const fileContent = await readFile(filePath);
		
		return new Response(fileContent, {
			headers: {
				'Content-Type': mimeTypes[normalizedExt],
				'Cache-Control': 'public, max-age=31536000'
			}
		});
	} catch (e) {
		console.error(`Failed to read file from ${filePath}:`, e);
		throw error(404, 'File not found');
	}
};