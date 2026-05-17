import { json } from '@sveltejs/kit';
import { GOOGLE_TRANSLATE_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	try {
		const { text, targetLanguage } = await request.json();

		if (!text || !targetLanguage) {
			return json({ error: 'Missing text or targetLanguage' }, { status: 400 });
		}

		const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				q: text,
				target: targetLanguage,
				format: 'text' // Google Translate handles plain text. Change to 'html' if you decide to send parsed HTML instead.
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Google Translate API Error:', errorData);
			return json({ error: 'Translation failed' }, { status: response.status });
		}

		const data = await response.json();
		return json({ translatedText: data.data.translations[0].translatedText });
	} catch (error) {
		console.error('Error in translate API:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}