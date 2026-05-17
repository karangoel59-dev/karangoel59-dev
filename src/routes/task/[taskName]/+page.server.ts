import { error } from '@sveltejs/kit';
import { getTask } from '$lib/server/tasks';
import type { PageServerLoad } from './$types';
import { getAIInsight } from '$lib/server/aiCommentator';

// Simple in-memory cache for AI responses per task
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // Cache for 1 hour

export const load: PageServerLoad = async ({ params }) => {
	try {
		const taskName = params.taskName;
		const task = (await getTask(taskName))[0];
		if (task) {
			// Strip frontmatter from content
			const contentWithoutFrontmatter = task.content.replace(/^---[\s\S]*?---\n*/, '');

			const now = Date.now();
			let aiCommentPromise;
			const cachedInsight = cache.get(taskName);

			if (cachedInsight && (now - cachedInsight.timestamp) <= CACHE_TTL) {
				aiCommentPromise = Promise.resolve(cachedInsight.data);
			} else {
				aiCommentPromise = getAIInsight('task', { content: contentWithoutFrontmatter }).then(insight => {
					cache.set(taskName, { data: insight, timestamp: Date.now() });
					return insight;
				}).catch(err => {
					console.error("AI Insight error:", err);
					return null;
				});
			}

			return {
				taskName: task.Task,
				To: task.To,
				From: task.From,
				type: task.Type,
				link: task.LINK,
				status: task.Status,
				content: contentWithoutFrontmatter,
				aiComment: aiCommentPromise
			};
		}

		error(404, 'Task not found');
	} catch (e) {
		console.error(e);
		error(404, 'Task not found');
	}
};
