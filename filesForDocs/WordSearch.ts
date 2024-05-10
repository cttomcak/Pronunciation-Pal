import WordVisemes from './WordVisemes.svelte';
import WhisperRecord from './WhisperRecord.svelte';
import { userData } from './userData';
import { onDestroy } from 'svelte';

/** User favorites list */
let userFavorites: string[] = [];

/** Function to unsub from the userData store */
const unsubscribe = userData.subscribe((value) => {
	if (value) {
		userFavorites = JSON.parse((value as any).favorite_words || '[]');
	}
});

onDestroy(unsubscribe);

/** If browser speech-to-text is enabled */
let speech_enabled: boolean = false;
/** Speech recognition object */
let recognizer: any;
/** Whether the browser is recording right now */
let recording: boolean = false;
/** Search bar text value */
let search_text: string = '';
/** List of words currently searched */
let word_list: string[] = [];
/** List to store errors if they happen */
let errors: string[] = [];
/** Whether to show favorites or not */
let showFavorites: boolean = true;
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
			recognizer.onstart = function () {
				recording = true;
			};
			recognizer.onend = function () {
				recording = false;
			};
			recognizer.onerror = function () {
				recording = false;
			};
		}
	} else {
		console.error('SpeechRecognition API not supported on this browser');
	}
}

/**
 * Starts recording speech using the browser's speech recognition API.
 */
function record_speech() {
	// Don't need to check since the button won't exist if feature not supported
	recognizer.start();
}

/**
 * Callback function for speech recognition results.
 * @param {SpeechRecognitionEvent} result - The result object from speech recognition.
 */
function results_callback(result: SpeechRecognitionEvent) {
	search_text = result.results[0][0].transcript;
	update_word_list();
}

/**
 * Displays an error message for a certain duration.
 * @param {CustomEvent<string>} event - The error message to display.
 */
function show_error(event: CustomEvent<string>) {
	console.log('test');
	errors.push(event.detail);
	errors = errors;
	setTimeout(() => {
		errors.shift();
		errors = errors;
	}, 5000);
}

/**
 * Removes a word from the word list.
 * @param {CustomEvent<number>} event - The index of the word to remove.
 */
function remove_word(event: CustomEvent<number>) {
	word_list.splice(event.detail, 1);
	word_list = word_list;
}

/**
 * Handles keydown event for input textbox.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handle_keydown(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.code === 'Enter') {
		update_word_list();
	}
}

/**
 * Updates the word list, inserting new words at the start.
 */
function update_word_list() {
	// Add in new words if they exist
	if (search_text.length > 0) {
		word_list = [...search_text.split(' '), ...word_list];
		if (word_list.length > 10) {
			word_list = word_list.slice(0, 10);
		}
	}
}

/**
 * Handles event emitted by WhisperRecord component.
 * @param {CustomEvent} event - The custom event object.
 */
function handleWhisperEvent(event: CustomEvent) {
	const transcription = event.detail.transcription;
	if (transcription) {
		search_text = transcription;
		update_word_list();
	}
}

/**
 * Handles if favorite word was pressed; fills the text input and updates the word list.
 * @param event Button Press Event
 */
function handleFavButtonPress(event: Event) {
	search_text = (event.target as HTMLButtonElement).id;
	update_word_list();
}
