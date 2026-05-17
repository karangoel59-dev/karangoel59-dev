import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { clearTasks } from '$lib/server/tasks';

export async function POST() {
	try {
		const uploadsDir = path.resolve('data/uploads');
		
		// Delete all files in uploadsDir
		if (fs.existsSync(uploadsDir)) {
			fs.rmSync(uploadsDir, { recursive: true, force: true });
		}
		
		// Recreate empty uploadsDir
		fs.mkdirSync(uploadsDir, { recursive: true });

		// Tell MarkdownDB to clear and reinitialize
		await clearTasks();

		return json({ success: true });
	} catch (e) {
		console.error('Clear error:', e);
		return json({ error: 'Failed to clear data' }, { status: 500 });
	}
}
