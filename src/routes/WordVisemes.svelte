<script lang="ts">
	import VisemeImage from './VisemeImage.svelte';
	import { phoneme_to_viseme_dict } from '../lib/PhonemeVisemeDict';
<<<<<<< HEAD
	import { createEventDispatcher, onDestroy } from 'svelte';
	import AudioPlayer from '$lib/AudioPlayer.svelte';
	import AddFavoriteButton from './AddFavoriteButton.svelte';
	import { userData } from './userData';
	
	/** Whether to show favorite button */
    let showFavoriteButton = false;
=======
	import { createEventDispatcher, onMount } from 'svelte';
	import AudioPlayer from '$lib/AudioPlayer.svelte';
	import PhonemeRecord from './PhonemeRecord.svelte';
>>>>>>> 5f641c8 (Add PhonemeRecord component and update WordVisemes)

	/** Function to unsub from the userData store */
    const unsubscribe = userData.subscribe(value => {
		if (value)
		{
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
	let phonemeAnalysis: string = '';
	let phonemeAnalysisAvailable: boolean = false;

	onMount(async () => {
        const health = await fetch('http://localhost:5000/api/health');
		phonemeAnalysisAvailable = health.status == 200;
	});

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

	/** Switch images on or off */
	function toggleImages() {
		showViseme = !showViseme;
	}

	/** Remove this word/component using events system */
	function removeWord() {
		dispatch('remove', index);
	}
	function updatePhonemes(event: CustomEvent) {
		phonemeAnalysis = event.detail.phonemes;
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
			{#if phonemeAnalysisAvailable}
				<PhonemeRecord on:newPhonemes={updatePhonemes}/>
			{/if}
			{#if phonemes}
				<button id="toggle_button" on:click={toggleImages}>Toggle Diagrams</button>
			{/if}
			<div>
			<label style="margin-left:5px;" for="show_images">Show Images</label>
			<input name="show_images" type="checkbox" bind:checked={showImages}>
			</div>
			</div>
			<p>{phonemeAnalysis}</p>
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
	.button-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.general_info {
		margin-top: 1rem;
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
		margin-top: 1.2rem;
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
		margin-bottom: 0.5rem;
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
		margin-bottom: 1rem;
	}
	.info-box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
