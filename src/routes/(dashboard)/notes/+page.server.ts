import { getTask } from '$lib/server/tasks';
import { getAIInsight } from '$lib/server/aiCommentator';

// Simple in-memory cache for AI responses
let cachedInsight: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60; // Cache for 1 hour

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const tasks = await getTask('Things To Note') || [];
	
	const notes = tasks.map(t => ({
		content: t.content,
		From: t.From,
		To: t.To
	}));

	const now = Date.now();
	let aiCommentPromise;
	
	if (!cachedInsight || (now - cachedInsight.timestamp) > CACHE_TTL) {
		aiCommentPromise = getAIInsight('journal', { notes }).then(insight => {
			cachedInsight = { data: insight, timestamp: Date.now() };
			return insight;
		}).catch(err => {
			console.error("AI Insight error:", err);
			return null;
		});
	} else {
		aiCommentPromise = Promise.resolve(cachedInsight.data);
	}

	return { 
		notes,
		aiComment: aiCommentPromise
	};
}