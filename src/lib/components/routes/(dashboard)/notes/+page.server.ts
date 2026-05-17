import { getTask } from '$lib/server/tasks';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const tasks = (await getTask('Things To Note')) || [];

	const notes = tasks.map((t) => ({
		content: t.content,
		From: t.From,
		To: t.To
	}));

	return { notes };
}
