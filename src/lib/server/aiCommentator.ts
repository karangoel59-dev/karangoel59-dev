/**
 * Logic for generating contextual AI comments based on page data.
 * Configured for Azure OpenAI (GPT-4o / GPT-4o-mini).
 */
import { env } from '$env/dynamic/private';

export type CommentType = 'quick-links' | 'journal' | 'task' | 'calendar';

export async function getAIInsight(type: CommentType, data: any): Promise<string> {
	let prompt = '';

	switch (type) {
		case 'quick-links':
			prompt = `Analyze my collection of bookmarks/links: ${JSON.stringify(data.links)}. 
			Also evaluate my recent journal metadata: ${JSON.stringify(data.context?.journal || [])}. 
			Provide an overall insight into my work patterns: mention how many unique days I've worked, my most active areas/topics, and how the links support this focus.`;
			break;
		case 'journal':
			prompt = `Review my journal tasks: ${JSON.stringify(data)}. 
			Identify the 2-3 most critical tasks and briefly explain why they should be prioritized.`;
			break;
		case 'task':
			prompt = `Analyze the following task document: "${data.content || ''}". 
			Provide a concise commentary on complexity, progress, or potential blockers identified in the text.`;
			break;
		case 'calendar':
			prompt = `Analyze my task timeline and schedule: ${JSON.stringify(data)}. 
			Highlight sessions that took a long time, identify deep work patterns, and note if I am over-scheduled.`;
			break;
	}

	try {
		const response = await fetch(env.AZURE_OPENAI_ENDPOINT as string, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': env.AZURE_OPENAI_API_KEY as string
			},
			body: JSON.stringify({
				messages: [
					{
						role: 'system',
						content:
							'You are an Intelligent Workflow Commentator. Provide concise, high-value insights (under 100 words) based on the provided user data.'
					},
					{ role: 'user', content: prompt }
				],
				max_tokens: 250,
				temperature: 0.7
			})
		});

		const result = await response.json();
		return result.choices?.[0]?.message?.content?.trim() || 'Insight generated but empty.';
	} catch (error) {
		console.error('AI Insight Error:', error);
		return 'Workflow analysis paused. Please check your AI connection configuration.';
	}
}
