import { getAllTasks } from '$lib/server/tasks';

export function load() {
	return {
		tasks: getAllTasks()
	};
}
