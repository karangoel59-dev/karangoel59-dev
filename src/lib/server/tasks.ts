import fs from 'fs';
import path from 'path';

export interface TaskItem {
	Task: string;
	' '?: string;
	Date: string;
	LINK: string;
	'Task Type': string;
}

export interface Task extends TaskItem {
	content: string;
}

function getTargetDir(): string | null {
	const uploadsDir = path.resolve('data/uploads');
	const fallbackDir = path.resolve('ref/Work Dashboard/To Do List/To Do List');

	if (fs.existsSync(uploadsDir)) {
		const files = fs.readdirSync(uploadsDir);
		if (files.some((f) => f.endsWith('.md'))) {
			return uploadsDir;
		}
	}

	if (fs.existsSync(fallbackDir)) {
		return fallbackDir;
	}

	return null;
}

export function parseMarkdownFile(filePath: string): Task | null {
	try {
		const content = fs.readFileSync(filePath, 'utf-8');
		const lines = content.split('\n');

		let taskName = '';
		let date = '';
		let link = '';
		let taskType = '';

		// Extract task name from filename by default
		const fileName = path.basename(filePath, '.md');
		taskName = fileName.replace(/ [a-f0-9]{32}$/, '').trim(); // Remove Notion ID

		for (let i = 0; i < Math.min(lines.length, 20); i++) { // Look in first 20 lines
			const line = lines[i].trim();
			if (line.startsWith('# ')) {
				// Prefer H1 if it exists
				taskName = line.replace(/^#\s*/, '').trim();
			} else if (line.startsWith('Date:')) {
				date = line.replace(/^Date:\s*/, '').trim();
			} else if (line.startsWith('LINK:')) {
				link = line.replace(/^LINK:\s*/, '').trim();
			} else if (line.startsWith('Task Type:')) {
				taskType = line.replace(/^Task Type:\s*/, '').trim();
			}
		}

		return {
			Task: taskName,
			Date: date,
			LINK: link,
			'Task Type': taskType,
			content
		};
	} catch (e) {
		console.error(`Error parsing ${filePath}:`, e);
		return null;
	}
}

export function getAllTasks(): TaskItem[] {
	const targetDir = getTargetDir();
	if (!targetDir) {
		return [];
	}

	const files = fs.readdirSync(targetDir);
	const tasks: TaskItem[] = [];

	for (const file of files) {
		if (file.endsWith('.md')) {
			const task = parseMarkdownFile(path.join(targetDir, file));
			if (task) {
				tasks.push(task);
			}
		}
	}

	return tasks;
}

export function getTask(encodedTaskName: string): Task | null {
	const taskName = decodeURIComponent(encodedTaskName);
	const targetDir = getTargetDir();
	if (!targetDir) {
		return null;
	}

	const files = fs.readdirSync(targetDir);

	for (const file of files) {
		if (file.endsWith('.md')) {
			const filePath = path.join(targetDir, file);
			const task = parseMarkdownFile(filePath);
			if (task && task.Task === taskName) {
				return task;
			}
		}
	}
	return null;
}
