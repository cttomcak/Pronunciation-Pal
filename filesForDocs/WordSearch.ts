import WordVisemes from "./WordVisemes.svelte";
import WhisperRecord from "./WhisperRecord.svelte";

let speech_enabled: boolean = false;
let recognizer: any;
let recording: boolean = false;
let search_text: string = '';
let errors: string[] = [];
// let generated_words: string[] = [];

// Check if window is defined (running on the client side)
if (typeof window !== 'undefined') {
    // Use type assertion to inform TypeScript about 'webkitSpeechRecognition'
    let SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognizer = new SpeechRecognition();
        if (recognizer) {
            recognizer.onresult = results_callback;
            speech_enabled = true;
        }
    } else {
        console.error('SpeechRecognition API not supported on this browser');
    }
}

/**
 * Starts recording speech using the browser's speech recognition API.
 */
function record_speech() {
    recording = true;
    // Don't need to check since the button won't exist if feature not supported
    recognizer.start();
}

/**
 * Callback function for speech recognition results.
 * @param {SpeechRecognitionEvent} result - The result object from speech recognition.
 */
function results_callback(result: SpeechRecognitionEvent) {
    recording = false;
    search_text = result.results[0][0].transcript;
}

/**
 * Displays an error message for a certain duration.
 * @param {string} error - The error message to display.
 */
function show_error(error: string) {
    console.log("test");
    errors.push(error);
    errors = errors;
    setTimeout(() => {
        errors.shift();
        errors = errors;
    }, 10000);
}

/**
 * Generates information for words in the search text box.
 */
async function generate_info() {
    let card_div = document.getElementById('viseme_container');

    if (search_text.length > 0 && card_div) {
        let words_list = search_text.split(' ');

        for (let i = 0; i < words_list.length; i++) {
            // if (generated_words.includes(words_list[i]))
            // {
            // 	error_box.innerHTML += `Already generated results for ${words_list[i]}<br>`;
            // 	continue;
            // }
            // generated_words.push(words_list[i]);

            console.log('Generating info on "' + words_list[i] + '"');

            // https://dictionaryapi.dev/
            let api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + words_list[i];

            // Make an API request
            try {
                const response = await fetch(api_url);
                const data = await response.json();

                // Check if the API request was successful
                if (response.ok) {
                    // Process the data and update the UI
                    handle_api_response(words_list[i], data);
                } else {
                    console.error(`Error: ${response.status} - ${data.message}`);
                    show_error(`No results for ${words_list[i]}, sorry!`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                show_error(`Error fetching data for ${words_list[i]}, sorry!`);
            }
        }
    }
}

/**
 * Handles the API response for a word.
 * @param {string} word - The word for which the API response is being handled.
 * @param {any} data - The API response data.
 */
function handle_api_response(word: string, data: any) {
    // Extract relevant information from the API response
    const definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available';
    const phonemes = data[0]?.phonetic || data[0]?.phonetics[0]?.text || data[0]?.phonetics[1]?.text || 'No phonemes available';
    const pronunciation = data[0]?.phonetics[0]?.audio || null;

    let viseme_container = document.getElementById('viseme_container');

    if (viseme_container)
    {
        viseme_container.innerHTML = '';
        // Dynamically create WordVisemes component and add it to viseme_container
        let VisemesContainer = new WordVisemes({
            target: viseme_container,
            props: {
                word,
                definition,
                phonemes,
                pronunciation
            }
        });
    }
}

/**
 * Handles keydown event for input textbox.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handle_keydown(event: KeyboardEvent)
{
    if (event.key === 'Enter' || event.code === 'Enter') {
        generate_info();
    }
}

/**
 * Handles event emitted by WhisperRecord component.
 * @param {CustomEvent} event - The custom event object.
 */
function handleWhisperEvent(event: CustomEvent)
{
    const transcription = event.detail.transcription;
    if (transcription)
    {
        search_text = transcription;
    }
}