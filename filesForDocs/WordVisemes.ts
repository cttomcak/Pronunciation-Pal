import VisemeImage from './VisemeImage.svelte';
import { phoneme_to_viseme_dict } from '../lib/PhonemeVisemeDict';
import { createEventDispatcher, onDestroy } from 'svelte';
import AudioPlayer from '$lib/AudioPlayer.svelte';
import AddFavoriteButton from './AddFavoriteButton.svelte';
import { userData } from './userData';

/** Whether to show favorite button */
let showFavoriteButton = false;

/** Function to unsub from the userData store */
const unsubscribe = userData.subscribe((value) => {
	if (value) {
		showFavoriteButton = true;
	}
});

onDestroy(unsubscribe);

/** Word in question */
export let word: string = '';
/** Index for if we want to remove this word */
export let index: number = 0;
/** Definition of word */
export let definition: string = '';
/** Phonemes of word */
export let phonemes: string = '';
/** Pronunciation sound API link */
export let pronunciation: string = '';

/** Event dispatcher for events based communication with parent component */
const dispatch = createEventDispatcher();

/** For the phonemes after removing unneeded characters */
let processed;
/** Whether to show viseme images or speech sound diagram in this component's children */
let showViseme = true;
/** Visemes list */
let visemes: string[][] = [];
/** Corresponding phonemes */
let phonemesList: string[] = [];
/** Whether to show images or not (save space on page) */
let showImages = true;

/**
 * Generates information for this word
 */
async function generate_info() {
	console.log(`Generating info on "${word}"`);

	// https://dictionaryapi.dev/
	let api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;

	// Make an API request
	try {
		const response = await fetch(api_url);
		const data = await response.json();

		// Check if the API request was successful
		if (response.ok) {
			// Process the data and update the UI
			definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available';
			phonemes =
				data[0]?.phonetic ||
				data[0]?.phonetics[0]?.text ||
				data[0]?.phonetics[1]?.text ||
				'No phonemes available';
			pronunciation = data[0]?.phonetics[0]?.audio || null;
		} else {
			console.error(`Error: ${response.status} - ${data.message}`);
			dispatch('error', `No results for ${word}, sorry!`);
		}
	} catch (error) {
		console.error('Error fetching data:', error);
		dispatch('error', `Error fetching data for ${word}, sorry!`);
	}
	processed = phonemes.replaceAll(/[\/\(\)\[\]ˈˌ.]/g, '');
	visemes = [];
	phonemesList = [];
	if (phonemes != 'No phonemes available') {
		for (let i = 0; i < processed.length; i++) {
			let viseme;

			// Case if the next phoneme is 2 characters
			if (i != processed.length - 1 && phoneme_to_viseme_dict[processed.substring(i, i + 2)]) {
				viseme = phoneme_to_viseme_dict[processed.substring(i, i + 2)];
				phonemesList.push(processed.substring(i, i + 2));
				visemes.push(viseme.split(','));
				i += 1;
			}
			// Case if the next phoneme is 1 character
			else if (phoneme_to_viseme_dict[processed.substring(i, i + 1)]) {
				viseme = phoneme_to_viseme_dict[processed.substring(i, i + 1)];
				phonemesList.push(processed.substring(i, i + 1));
				visemes.push(viseme.split(','));
			}
			// We can't find the phoneme. Give error.
			else {
				console.error('UNMAPPED PHONEME CHARACTER: "' + processed.substring(i, i + 1) + '"');
				console.error('Full phonemes = "' + processed + '"');
			}
		}
		console.log('Phonemes: ' + processed + '\n' + 'Visemes: ' + visemes);
	}
	visemes = visemes;
}
$: if (word) {
	definition = '';
	phonemes = '';
	pronunciation = '';
	generate_info();
}

/** Switch images on or off */
function toggleImages() {
	showViseme = !showViseme;
}

/** Remove this word/component using events system */
function removeWord() {
	dispatch('remove', index);
}
