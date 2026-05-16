import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export function load({ params }) {
	const taskName = params.taskName;
	const refDir = path.resolve('ref/Work Dashboard/To Do List/To Do List');

	try {
		const files = fs.readdirSync(refDir);
		const decodedTaskName = decodeURIComponent(taskName).trim();
		const cleanTaskName = decodedTaskName.replace(/\u00a0/g, ' ').trim();

		let matchedFile = files.find((file) => {
			if (!file.endsWith('.md')) return false;
			const normalizedFileName = file.replace(/\.md$/, '').trim();
			// Remove the trailing ID from filename which is typically a space followed by a 32-char hex string
			const nameWithoutId = normalizedFileName.replace(/ [a-f0-9]{32}$/, '').trim();

			return nameWithoutId === cleanTaskName || normalizedFileName.startsWith(cleanTaskName);
		});

		if (!matchedFile) {
			// fallback: simple contains match
			matchedFile = files.find((file) => file.includes(cleanTaskName));
		}

		if (matchedFile) {
			const content = fs.readFileSync(path.join(refDir, matchedFile), 'utf-8');
			return {
				taskName: cleanTaskName,
				content
			};
		}

		throw error(404, 'Task not found');
	} catch (e) {
		console.error(e);
		throw error(404, 'Task not found');
	}
}
