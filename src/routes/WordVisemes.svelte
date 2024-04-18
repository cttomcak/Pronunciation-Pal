<script lang="ts">
	import VisemeImage from './VisemeImage.svelte';
	import { phoneme_to_viseme_dict } from '../lib/PhonemeVisemeDict';
	import AudioPlayer from '$lib/AudioPlayer.svelte';

	export let word: string = '';
	export let definition: string = '';
	export let phonemes: string = '';
	export let pronunciation: string = '';

	let processed = phonemes;
	let showViseme = true;

	// Remove characters that we aren't using right now
	processed = processed.replaceAll('/', '');
	processed = processed.replaceAll('ˈ', '');
	processed = processed.replaceAll('(', '');
	processed = processed.replaceAll(')', '');
	processed = processed.replaceAll('[', '');
	processed = processed.replaceAll(']', '');
	processed = processed.replaceAll('ˌ', '');
	processed = processed.replaceAll('.', '');

	let visemes: string[] = [];
	let phonemesList: string[] = [];
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

	function toggleImages() {
		showViseme = !showViseme;
	}
</script>

<div class="general_info">
	<div class="flex-column-center background-white">
		<!-- Display some other info about the word -->
		<div class="info-box">
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
		padding: 5px;
		background-color: #4285f4;
		color: #ffffff;
		border: 3px solid #0062ff;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
