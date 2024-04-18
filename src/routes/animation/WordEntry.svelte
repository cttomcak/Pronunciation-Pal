<script lang="ts">
	import WordAnimation from './WordAnimation.svelte';

	let visemes: string[] = [];
	let phonemes: string[] = [];

    let speech_enabled: boolean = false;
    let recognizer: any;
	let recording: boolean = false;
	let search_text: string = '';

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
		// Extract relevant information from the API response
		const definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition available';
		const phonemes = data[0]?.phonetic || data[0]?.phonetics[0]?.text || data[0]?.phonetics[1]?.text || 'No phonemes available';
		const pronunciation = data[0]?.phonetics[0]?.audio || null;

		let processed = phonemes;

        processed = processed.replaceAll('/', '');
        processed = processed.replaceAll('ˈ', '');
        processed = processed.replaceAll('(', '');
        processed = processed.replaceAll(')', '');
        processed = processed.replaceAll('[', '');
        processed = processed.replaceAll(']', '');
        processed = processed.replaceAll('ˌ', '');
        processed = processed.replaceAll('.', '');

        
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

</script>

<div class="search-wrapper">
	<div class="record-buttons">
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
		<span style="display: inline-block;">
			<div class="search">
				<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
				<input type="search" class="input" id="words_text_box" placeholder="Search" bind:value={search_text} on:keydown={handle_keydown}/>
			</div>
		</span>
	</div>
	<WordAnimation visemesProp={visemes} phonemesProp={phonemes} />
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
		flex-direction: column;
		align-items: center;
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
		transition: .3s ease;
	}

	.input::placeholder {
		color: #9e9ea7;
	}

	.input:focus, input:hover {
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
</style>
