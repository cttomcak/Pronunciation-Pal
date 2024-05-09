<script lang="ts">
	import WordAnimation from './WordAnimation.svelte';
	import { phoneme_to_viseme_dict } from '$lib/PhonemeVisemeDict';
	import type { SvelteComponent } from 'svelte';
	import AudioPlayer from '$lib/AudioPlayer.svelte';
	import WhisperRecord from '../WhisperRecord.svelte';
	import { userData } from './userData';
	import { onDestroy } from 'svelte';
	import AddFavoriteButton from './AddFavoriteButton.svelte';
 
	/** User favorites list */
	let userFavorites: string[] = [];
	/** Whether to show favorites or not */
	let showFavorites: boolean = true;
	/** Whether to show favorite button */
	let showFavoriteButton = false;

	/** Function to unsub from the userData store */
	const unsubscribe = userData.subscribe((value) => {
		if (value) {
			showFavoriteButton = true;
			userFavorites = JSON.parse((value as any).favorite_words || '[]');
		}
	});

	onDestroy(unsubscribe);

	/** Visemes list to be sent to child component */
	let visemesList: string[] = [];
	/** Phonemes list to be sent to child component */
	let phonemesList: string[] = [];
	/** Child object (WordAnimation.svelte) */
	let childObject: SvelteComponent;

	/** If browser speech-to-text is enabled */
	let speech_enabled: boolean = false;
	/** Speech recognition object */
	let recognizer: SpeechRecognition;
	/** Whether the browser is recording right now */
	let recording: boolean = false;
	/** Search bar text value */
	let search_text: string = '';

	/** Current word */
	let currentWord: string;
	/** Word's definition */
	let definition: string;
	/** Word's phonemes */
	let phonemes: string;
	/** Word's audio URL */
	let pronunciation: string;

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
		generate_info();
	}

	/**
	 * Generates information for words in the search text box.
	 */
	async function generate_info() {
		if (search_text.length > 0) {
			let words_list = search_text.split(' ');

			for (let i = 0; i < words_list.length; i++) {
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
					}
				} catch (error) {
					console.error('Error fetching data:', error);
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
		console.log('Handling api response for', word);

		// Extract relevant information from the API response
		currentWord = word;
		definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available';
		phonemes =
			data[0]?.phonetic ||
			data[0]?.phonetics[0]?.text ||
			data[0]?.phonetics[1]?.text ||
			'No phonemes available';
		pronunciation = data[0]?.phonetics[0]?.audio || null;

		let processed = phonemes;

		processed = processed.replaceAll('/', '');
		processed = processed.replaceAll('ˈ', '');
		processed = processed.replaceAll('(', '');
		processed = processed.replaceAll(')', '');
		processed = processed.replaceAll('[', '');
		processed = processed.replaceAll(']', '');
		processed = processed.replaceAll('ˌ', '');
		processed = processed.replaceAll('.', '');

		console.log('processed phonemes:', processed);

		phonemesList = ['silence', 'silence'];
		visemesList = ['sil', 'sil'];
		if (phonemes != 'No phonemes available') {
			for (let i = 0; i < processed.length; i++) {
				let viseme;

				// Case if the next phoneme is 2 characters
				if (i != processed.length - 1 && phoneme_to_viseme_dict[processed.substring(i, i + 2)]) {
					viseme = phoneme_to_viseme_dict[processed.substring(i, i + 2)];
					viseme.split(',').forEach(vis => {
						phonemesList.push(processed.substring(i, i + 2));
						visemesList.push(vis);
					});
					i += 1;
				}
				// Case if the next phoneme is 1 character
				else if (phoneme_to_viseme_dict[processed.substring(i, i + 1)]) {
					viseme = phoneme_to_viseme_dict[processed.substring(i, i + 1)];
					viseme.split(',').forEach(vis => {
						phonemesList.push(processed.substring(i, i + 1));
						visemesList.push(vis);
					});
				}
				// We can't find the phoneme. Give error.
				else {
					console.error('UNMAPPED PHONEME CHARACTER: "' + processed.substring(i, i + 1) + '"');
					console.error('Full phonemes = "' + processed + '"');
				}
			}
		}
		phonemesList.push('silence');
		visemesList.push('sil');
		console.log(visemesList, phonemesList);

		let canvas_container = document.getElementById('canvas_container');

		if (canvas_container) {
			if (childObject) {
				childObject.$destroy();
			}

			canvas_container.innerHTML = '';

			if (visemesList.length > 0) {
				let Animation = new WordAnimation({
					target: canvas_container,
					props: {
						visemesProp: visemesList,
						phonemesProp: phonemesList
					}
				});
				childObject = Animation;
			}
		}
	}

	/**
	 * Handles keydown event for input textbox.
	 * @param {KeyboardEvent} event - The keydown event object.
	 */
	function handle_keydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.code === 'Enter') {
			generate_info();
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
		}
	}

	/**
	 * Fills text entry and calls generate_info() when a favorite word is pressed
	 * @param event - Button press event
	 */
	function handleFavButtonPress(event: Event) {
		search_text = (event.target as HTMLButtonElement).id;
		generate_info();
	}
</script>

<div class="search-wrapper">
	<div class="record-buttons">
		<WhisperRecord on:set_parent_text={handleWhisperEvent} />
		<!-- Record button, hides itself if not supported -->
		{#if speech_enabled}
			<button id="recording_button" on:click={record_speech}>
				{#if recording}
					Recording...
				{:else}
					Record (Browser)
				{/if}
			</button>
		{/if}
	</div>
	<span style="display: inline-block;">
		<div class="search">
			<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"
				><g
					><path
						d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
					></path></g
				></svg
			>
			<input
				type="search"
				class="input"
				id="words_text_box"
				placeholder="Search"
				bind:value={search_text}
				on:keydown={handle_keydown}
			/>
		</div>
	</span>
	<div class="favorites_section">
		{#if userFavorites.length > 0}
			<div>
				<label for="show_favorites">Show Favorites</label>
				<input name="show_favorites" type="checkbox" bind:checked={showFavorites} />
			</div>
			<div class="favorites_box">
				{#if showFavorites}
					{#each userFavorites as favWord}
						<button class="fav-button" on:click={handleFavButtonPress} id={favWord}
							>{favWord.charAt(0).toUpperCase() + favWord.slice(1)}</button
						>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
	{#if currentWord}
		<div class="general_info">
			<div class="flex-column-center background-white">
				<!-- Display some other info about the word -->
				<div class="info-box">
					<div class="definition-box">
						<strong>{currentWord.toUpperCase()}</strong>
						{#if phonemes}
							{phonemes}
						{/if}
					</div>
				</div>
				{#if definition}
					<p>{definition}</p>
				{/if}
				<div class="buttons-div">
					{#if pronunciation}
						<AudioPlayer audioUrl={pronunciation} />
					{:else}
						<p style="padding-right: 6px;"><strong>No Audio Available</strong></p>
					{/if}
					{#if showFavoriteButton}
						<AddFavoriteButton word={currentWord} />
					{/if}
				</div>
			</div>
		</div>
	{/if}
	<div id="canvas_container"></div>
</div>

<style>
	.search-wrapper {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.record-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	button {
		margin: 5px;
		padding: 10px;
		background-color: #4942e4;
		color: #ffffff;
		border: 3px solid #11009e;
		border-radius: 5px;
		cursor: pointer;
	}
	.search {
		margin: 5px;
		padding: 10px;
		display: flex;
		line-height: 28px;
		align-items: center;
		position: relative;
		max-width: 300px;
		z-index: 1;
	}
	.input {
		width: 100%;
		height: 40px;
		line-height: 28px;
		padding: 0 1rem;
		padding-left: 2.5rem;
		border: 2px solid black;
		border-radius: 50px;
		background-color: #ffffff;
		color: #0d0c22;
		transition: 0.3s ease;
	}
	.input::placeholder {
		color: #9e9ea7;
	}
	.input:focus,
	input:hover {
		outline: none;
		border-color: rgb(0, 0, 0);
		background-color: #ffffff;
		box-shadow: 0 0 0 2px rgb(0, 0, 0);
	}
	.icon {
		position: absolute;
		left: 1rem;
		fill: #9e9ea7;
		width: 1rem;
		height: 1rem;
	}
	.general_info {
		margin-top: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.flex-column-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.definition-box {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.definition-box strong {
		font-size: xx-large;
		margin-right: 1rem;
	}
	.info-box {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.favorites_section {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.favorites_box {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		min-width: 14rem;
		max-width: 40%;
		padding: 5px;
		margin: 5px;
	}
	.fav-button {
		margin: 2px;
		padding: 5px;
		background-color: #4942e4;
		color: #ffffff;
		border: 3px solid #11009e;
		border-radius: 4px;
		cursor: pointer;
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
