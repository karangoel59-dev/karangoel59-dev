import { getTask } from '$lib/server/tasks';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        const tasks = await getTask('Quick links');

        // Use .map() for cleaner array transformation
        const links = tasks.map(t => ({
            content: t.content,
            From: t.From,
            To: t.To
        }));

        return { links };
    } catch (e) {
        console.error(e);
        // Returns a standard SvelteKit error page
        throw error(500, 'Could not fetch quick links');
    }
}