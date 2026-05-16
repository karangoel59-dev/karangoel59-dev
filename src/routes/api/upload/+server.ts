import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

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
			// Ensure it's a markdown file
			if (!file.name.endsWith('.md')) continue;

			// Write file to uploads directory
			const buffer = Buffer.from(await file.arrayBuffer());
			// Use the filename provided by the client
			// Sanitize the filename to prevent directory traversal
			const sanitizedName = path.basename(file.webkitRelativePath || file.name);
			fs.writeFileSync(path.join(uploadsDir, sanitizedName), buffer);
			savedCount++;
		}

		return json({ success: true, count: savedCount });
	} catch (e) {
		console.error('Upload error:', e);
		return json({ error: 'Failed to process upload' }, { status: 500 });
	}
}
