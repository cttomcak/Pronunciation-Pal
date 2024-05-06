import type { RequestHandler } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';

// For some reason the bodies of these requests aren't json, they're ReadableStreams.
// The requests made in the front end were completely normal, so I personally have no clue what this is.
export const POST: RequestHandler = async (request) => {
	// Read the request body from the ReadableStream
	const body = JSON.parse(await readRequestBody(request.request));
	const { word } = body;

	const user = await User.findByPk(request.locals.user.id);
	if (!user) throw new Error('User not found');

	const favoriteWords = JSON.parse(user.favorite_words || '[]');
	const index = favoriteWords.indexOf(word);
	if (index > -1) {
		favoriteWords.splice(index, 1);
	}
	user.favorite_words = JSON.stringify(favoriteWords);

	await user.save();

	// Return a Response object
	return new Response(JSON.stringify({ message: 'Favorite word added successfully' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

async function readRequestBody(request) {
	// Read the request body from the ReadableStream
	const reader = request.body.getReader();
	const decoder = new TextDecoder('utf-8');
	let requestBody = '';

	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			break;
		}

		requestBody += decoder.decode(value);
	}

	console.log('In Function: ', requestBody);

	return requestBody;
}
