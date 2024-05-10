import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

/**
 * POST request handler to transcribe an audio file using the OpenAI API.
 * @param request - The incoming request object.
 * @returns A Response object containing the transcription or an error message.
 */
export async function POST({ request }) {
    const formData: FormData = await request.formData();
    const file = formData.get('file');

    // Ensure file exists
    if (!file) {
        return json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Construct OpenAI API request
    const data = new FormData();
    data.append('file', file);
    data.append('model', 'whisper-1');
    data.append('response_format', 'json');
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: new Headers({
            Authorization: `Bearer ${OPENAI_API_KEY}`
        }),
        body: data
    });

    // Return the response from the OpenAI API
    return json(await response.json(), { status: response.status });
}
