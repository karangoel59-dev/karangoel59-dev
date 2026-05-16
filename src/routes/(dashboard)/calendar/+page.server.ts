import { getAllTasks } from '$lib/server/tasks';

export async function load() {
	const allTasks = await getAllTasks();
	return {
		tasks: allTasks.filter(
			(task) =>
				task.Task.toLowerCase() !== 'things to note' &&
				task.Task.toLowerCase() !== 'quick links' &&
				task.Type?.toLowerCase() !== 'quick links'
		)
	};
}
