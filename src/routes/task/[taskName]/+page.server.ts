import { error } from '@sveltejs/kit';
import { getTask } from '$lib/server/tasks';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const task = await getTask(params.taskName);
		if (task) {
			// Strip frontmatter from content
			const contentWithoutFrontmatter = task.content.replace(/^---[\s\S]*?---\n*/, '');

			return {
				taskName: task.Task,
				date: task.Date,
				type: task.Type,
				link: task.LINK,
				status: task.Status,
				content: contentWithoutFrontmatter
			};
		}

		error(404, 'Task not found');
	} catch (e) {
		console.error(e);
		error(404, 'Task not found');
	}
};
