<script lang="ts">
	import VisemeImage from './VisemeImage.svelte';
	import { phoneme_to_viseme_dict } from '../lib/PhonemeVisemeDict';
	import { createEventDispatcher } from 'svelte';
	import AudioPlayer from '$lib/AudioPlayer.svelte';

	export let word: string = '';
	export let index: number = 0;
	export let definition: string = '';
	export let phonemes: string = '';
	export let pronunciation: string = '';

	const dispatch = createEventDispatcher();

	let processed;
	let showViseme = true;
	let visemes: string[] = [];
	let phonemesList: string[] = [];

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
				phonemes = data[0]?.phonetic || data[0]?.phonetics[0]?.text || data[0]?.phonetics[1]?.text || 'No phonemes available';
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
					visemes.push(viseme);
					i += 1;
				}
				// Case if the next phoneme is 1 character
				else if (phoneme_to_viseme_dict[processed.substring(i, i + 1)]) {
					viseme = phoneme_to_viseme_dict[processed.substring(i, i + 1)];
					phonemesList.push(processed.substring(i, i + 1));
					visemes.push(viseme);
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
		generate_info();
	}

	function toggleImages() {
		showViseme = !showViseme;
	}

	function removeWord() {
		dispatch('remove', index);
	}

</script>

<div class="general_info">
	<div class="flex-column-center background-white">
		<!-- Display some other info about the word -->
		<div class="info-box">
			<button class="close-button" aria-label="Close" on:click={removeWord}>
				<span aria-hidden="true">×</span>
			</button>
			<div class="definition-box">
				<p><strong>{word.toUpperCase()}</strong></p>
				<p class="phonemes">{phonemes}</p>
			</div>
			<p>{definition}</p>
			{#if pronunciation}
				<p><AudioPlayer audioUrl={pronunciation} /></p>
			{:else}
				<p><strong>No pronunciation available</strong></p>
			{/if}
			<button id="toggle_button" on:click={toggleImages}>Toggle Images</button>
		</div>
		<!-- Where the viseme pictures go -->
		<div id="pictures_go_here">
			{#each visemes as viseme, i}
				<VisemeImage {viseme} phoneme={phonemesList[i]} {showViseme} />
			{/each}
		</div>
	</div>
</div>

<style>
	.general_info {
		margin-top: 2rem;
	}
	.flex-column-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	.definition-box {
		display: flex;
		flex-direction: row;
	}
	.definition-box p {
		margin: 1rem 0 0 0;
	}
	.phonemes {
		margin-top: 1.8rem !important;
	}
	.definition-box strong {
		font-size: xx-large;
		margin-right: 1rem;
	}
	.background-white {
		background-color: white;
	}
	#pictures_go_here {
		display: flex; /* Display images side by side */
		flex-wrap: wrap; /* Wrap images to new row if necessary */
		justify-content: center; /* Center images horizontally */
	}
	button {
		margin: 5px;
		padding: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 5px;
		cursor: pointer;
	}

	.close-button {
		position: absolute;
		right: 10px;
		background-color: white;
		padding: 2px;
		margin: 0;
		border: none;
		font-size: 3rem;
		color: rgba(172, 172, 172, 0.5);
		transition: cubic-bezier(1, 0, 0, 1) 0.3s;
	}

	.close-button:hover {
		color: black;
	}
</style>
