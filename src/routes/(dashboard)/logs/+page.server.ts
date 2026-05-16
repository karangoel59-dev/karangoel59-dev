import { getAllTasks } from '$lib/server/tasks';

export async function load() {
	return {
		tasks: await getAllTasks()
	};
}
