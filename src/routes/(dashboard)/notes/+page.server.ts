import { getTask } from '$lib/server/tasks';

export async function load() {
	const task = await getTask('Things To Note');
	return {
		content: task ? task.content : '',
		date: task ? task.Date : ''
	};
}
