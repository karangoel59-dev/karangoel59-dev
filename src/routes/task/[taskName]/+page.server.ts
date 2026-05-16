import { error } from '@sveltejs/kit';
import { getTask } from '$lib/server/tasks';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const task = await getTask(params.taskName);
		if (task) {
			return {
				taskName: task.Task,
				content: task.content
			};
		}

		error(404, 'Task not found');
	} catch (e) {
		console.error(e);
		error(404, 'Task not found');
	}
};
