import { MarkdownDB } from 'mddb';
import path from 'path';
import fs from 'fs';

let mddbClient: MarkdownDB | null = null;

async function getClient() {
	if (!mddbClient) {
		mddbClient = new MarkdownDB({
			client: 'sqlite3',
			connection: {
				filename: 'markdown.db'
			}
		});
		await mddbClient.init();

		const uploadsDir = 'data/uploads';

		if (fs.existsSync(uploadsDir)) {
			const files = fs.readdirSync(uploadsDir);
			if (files.length > 0) {
				await mddbClient.indexFolder({
					folderPath: uploadsDir,
					ignorePatterns: []
				});
			}
		}
	}
	return mddbClient;
}

export async function refreshTasks() {
	if (mddbClient) {
		const uploadsDir = 'data/uploads';

		if (fs.existsSync(uploadsDir)) {
			await mddbClient.indexFolder({
				folderPath: uploadsDir,
				ignorePatterns: []
			});
		}
	}
}

export async function clearTasks() {
	if (mddbClient) {
		try {
			mddbClient._destroyDb();
		} catch (e) {
			console.error('Error destroying mddb db:', e);
		}
		mddbClient = null;
	}
	if (fs.existsSync('markdown.db')) {
		fs.unlinkSync('markdown.db');
	}
}

export interface TaskItem {
	Task: string;
	Date: string;
	Type: string;
	Status?: string;
	LINK: string;
}

export interface Task extends TaskItem {
	content: string;
}

export async function getAllTasks(): Promise<TaskItem[]> {
	try {
		const client = await getClient();
		const files = await client.getFiles();

		return files.map((file) => {
			const metadata = file.metadata || {};
			return {
				Task: metadata.Task || (file.url_path || file.file_path).replace(/%20/g, ' '),
				Date: metadata.Date || '',
				LINK: metadata.LINK || '',
				Type: metadata['Task Type'] || '',
				Status: metadata.Status || ''
			};
		});
	} catch (e) {
		return [];
	}
}

export async function getTask(encodedTaskName: string): Promise<Task | null> {
	try {
		const taskName = decodeURIComponent(encodedTaskName).trim();
		const cleanTaskName = taskName.replace(/\u00a0/g, ' ').trim();

		const client = await getClient();
		const files = await client.getFiles();

		const matchedFile = files.find((file) => {
			const metadataTask = (file.metadata?.Task || '').trim();
			if (metadataTask === cleanTaskName || metadataTask.startsWith(cleanTaskName)) return true;

			const normalizedFileName = path.basename(file.file_path, '.md').trim();
			const nameWithoutId = normalizedFileName.replace(/ [a-f0-9]{32}$/, '').trim();
			if (nameWithoutId === cleanTaskName || normalizedFileName.startsWith(cleanTaskName))
				return true;

			return normalizedFileName.includes(cleanTaskName);
		});

		if (matchedFile) {
			const rawContent = fs.readFileSync(matchedFile.file_path, 'utf-8');
			const content = rawContent.replace(/^---\n[\s\S]*?\n---\n/, '');
			const metadata = matchedFile.metadata || {};

			return {
				Task: metadata.Task || (matchedFile.url_path || matchedFile.file_path).replace(/%20/g, ' '),
				Date: metadata.Date || '',
				LINK: metadata.LINK || '',
				Type: metadata['Task Type'] || '',
				Status: metadata.Status || '',
				content
			};
		}
		return null;
	} catch (e) {
		console.error('Error getting task via MarkdownDB:', e);
		return null;
	}
}
