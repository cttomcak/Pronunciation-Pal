import { createEventDispatcher } from 'svelte';
import AudioPlayer from '$lib/AudioPlayer.svelte';

/** Word on card */
export let word = '';
/** Definition of word */
export let definition = '';
/** Phonemes of word */
export let phonemes = '';
/** URL to pronunciation audio file for word */
export let pronunciation = '';
/** Diagrams for speaking the word (not implemented) */
export let diagrams = '';

/** Event dispatcher for events based communication with parent component */
const dispatch = createEventDispatcher();

/** Sends an event to the parent component to delete the card */
function remove_card() {
	dispatch('remove', { word });
}
