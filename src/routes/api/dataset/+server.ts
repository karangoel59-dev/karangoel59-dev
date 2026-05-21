import { json } from '@sveltejs/kit';
import { getActiveDataset, getDatasets, setActiveDataset } from '$lib/server/dataset';
import { getClient } from '$lib/server/tasks';

export async function GET() {
	return json({
		current: getActiveDataset(),
		datasets: getDatasets()
	});
}

export async function POST({ request }) {
	try {
		const { name } = await request.json();
		if (!name) {
			return json({ error: 'Name is required' }, { status: 400 });
		}

		setActiveDataset(name);

		// Wait for the new dataset's database to be initialized
		await getClient();

		return json({ success: true, current: name });
	} catch (e) {
		console.error('Dataset switch error:', e);
		return json({ error: 'Failed to switch dataset' }, { status: 500 });
	}
}
