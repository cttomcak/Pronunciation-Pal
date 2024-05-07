<script lang="ts">
	import VisemeImage from './VisemeImage.svelte';
	import { phoneme_to_viseme_dict } from '../lib/PhonemeVisemeDict';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import AudioPlayer from '$lib/AudioPlayer.svelte';
	import AddFavoriteButton from './AddFavoriteButton.svelte';
	import { userData } from './userData';
	
    let showFavoriteButton = false;

    const unsubscribe = userData.subscribe(value => {
		if (value)
		{
			showFavoriteButton = true;
		}
    });

	onDestroy(unsubscribe);

	export let word: string = '';
	export let index: number = 0;
	export let definition: string = '';
	export let phonemes: string = '';
	export let pronunciation: string = '';

	const dispatch = createEventDispatcher();

	let processed;
	let showViseme = true;
	let visemes: string[][] = [];
	let phonemesList: string[] = [];
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

	function toggleImages() {
		showViseme = !showViseme;
	}

	function removeWord() {
		dispatch('remove', index);
	}

</script>

<div class="general_info">
	<div class="flex-column-center background-white">
		<button class="close-button" aria-label="Close" on:click={removeWord}>
			<span aria-hidden="true">×</span>
		</button>
		<!-- Display some other info about the word -->
		<div class="info-box">
			<div class="definition-box">
				<strong>{word.toUpperCase()}</strong>
				{phonemes}
			</div>
			<p>{definition}</p>
			<div class="buttons-div">
			{#if pronunciation}
				<AudioPlayer audioUrl={pronunciation} />
			{:else}
				<p style="padding-right: 6px;"><strong>No Audio Available</strong></p>
			{/if}
			{#if showFavoriteButton}
				<AddFavoriteButton word={word} />
			{/if}
			{#if phonemes}
				<button id="toggle_button" on:click={toggleImages}>Toggle Diagrams</button>
			{/if}
			<div>
			<label style="margin-left:5px;" for="show_images">Show Images</label>
			<input name="show_images" type="checkbox" bind:checked={showImages}>
			</div>
			</div>
		</div>
		<!-- Where the viseme pictures go -->
		{#if showImages}
		<div id="pictures_go_here">
			{#each visemes as viseme, i}
				<VisemeImage {viseme} phoneme={phonemesList[i]} {showViseme} />
			{/each}
		</div>
		{/if}
	</div>
</div>

<style>
	.general_info {
		margin-top: 2rem;
		width: 100%;
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
		justify-content: center;
		align-items: center;
		margin-top: 1.5rem;
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
		width: 100%;
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
	.buttons-div {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.info-box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
