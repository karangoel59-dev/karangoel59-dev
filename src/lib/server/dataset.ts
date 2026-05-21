import fs from 'fs';
import path from 'path';

const activeDatasetFile = 'data/active_dataset.txt';
const uploadsBaseDir = 'data/uploads';

export function getActiveDataset(): string {
	if (fs.existsSync(activeDatasetFile)) {
		const content = fs.readFileSync(activeDatasetFile, 'utf-8').trim();
		if (content) return content;
	}
	return 'default';
}

export function setActiveDataset(name: string) {
	if (!fs.existsSync('data')) {
		fs.mkdirSync('data', { recursive: true });
	}
	fs.writeFileSync(activeDatasetFile, name.trim(), 'utf-8');
}

export function getDatasets(): string[] {
	if (!fs.existsSync(uploadsBaseDir)) return [];
	return fs
		.readdirSync(uploadsBaseDir)
		.filter((f) => fs.statSync(path.join(uploadsBaseDir, f)).isDirectory());
}
