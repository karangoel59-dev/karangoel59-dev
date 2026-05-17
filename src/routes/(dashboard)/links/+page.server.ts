import { getTask, getClient } from '$lib/server/tasks';
import { error } from '@sveltejs/kit';
import { getAIInsight } from '$lib/server/aiCommentator';

// Simple in-memory cache for AI responses
let cachedInsight: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60; // Cache for 1 hour

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const aiEnabled = cookies.get('ai_insights_enabled') === 'true';
	try {
		const tasks = await getTask('Quick links');

		// Use .map() for cleaner array transformation
		const links = tasks.map((t) => ({
			content: t.content,
			From: t.From,
			To: t.To
		}));

		// Fetch additional context from MarkdownDB
		const client = await getClient();
		const journalEntries = await client.getFiles();

		const now = Date.now();

		let aiComment = null;
		if (aiEnabled) {
			// Check if we have a valid cached response
			if (!cachedInsight || now - cachedInsight.timestamp > CACHE_TTL) {
				// Pass the links along with journal and database metadata to the AI commentator
				const insight = await getAIInsight('quick-links', {
					links,
					context: {
						journal: journalEntries.map((f) => f.metadata)
					}
				});

				cachedInsight = { data: insight, timestamp: now };
			}
			aiComment = cachedInsight.data;
		}

		return {
			links,
			aiComment
		};
	} catch (e) {
		console.error(e);
		// Returns a standard SvelteKit error page
		throw error(500, 'Could not fetch quick links');
	}
}
