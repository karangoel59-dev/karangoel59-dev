import { getAllTasks } from '$lib/server/tasks';
import { getAIInsight } from '$lib/server/aiCommentator';

// Simple in-memory cache for AI responses
let cachedInsight: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 60; // Cache for 1 hour

export async function load() {
	const allTasks = await getAllTasks();
	const filteredTasks = allTasks.filter(
		(task) =>
			task.Task.toLowerCase() !== 'things to note' &&
			task.Task.toLowerCase() !== 'quick links' &&
			task.Type?.toLowerCase() !== 'quick links'
	);

	const now = Date.now();
	let aiCommentPromise;
	
	if (!cachedInsight || (now - cachedInsight.timestamp) > CACHE_TTL) {
		aiCommentPromise = getAIInsight('calendar', { tasks: filteredTasks }).then(insight => {
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
		tasks: filteredTasks,
		aiComment: aiCommentPromise
	};
}
