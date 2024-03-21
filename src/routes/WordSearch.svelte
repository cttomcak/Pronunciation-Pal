<script lang="ts">
    import WordVisemes from "./WordVisemes.svelte";

    let recognizer: any;
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
			}
		} else {
			// TO-DO: Put something on the page for this error lol
			console.error('SpeechRecognition API not supported on this browser');
		}
	}

	// Runs when record button is pressed
	function record_speech() {
		let recording_button = document.getElementById('recording_button');
		if (recording_button) {
			recording_button.innerHTML = 'Recording...';
		}
		if (recognizer) {
			let words_text_box = <HTMLInputElement>document.getElementById('words_text_box');
			if (words_text_box) {
				words_text_box.value = 'Recording...';
			}
			recognizer.start();
		}
	}

	// Runs when the speech recognition API automatically returns results
	function results_callback(result: any) {
		let recording_button = document.getElementById('recording_button');
		if (recording_button) {
			recording_button.innerHTML = 'Record';
		}
		let words_text_box = <HTMLInputElement>document.getElementById('words_text_box');
		if (words_text_box) {
			words_text_box.value = result.results[0][0].transcript;
		}
	}

	// A function to generate info on the words in the words text box
	async function generate_info() {
		let words_text_box = <HTMLInputElement>document.getElementById('words_text_box');
		let card_div = document.getElementById('viseme_container');
		let error_box = document.getElementById("display_errors_here");

		if (words_text_box && card_div && error_box) {
			let words_list = words_text_box.value.split(' ');

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
						error_box.innerHTML += `No results for ${words_list[i]}, sorry!<br>`;		
					}
				} catch (error) {
					console.error('Error fetching data:', error);
					error_box.innerHTML += `Error fetching data for ${words_list[i]}, sorry!<br>`;
				}
			}
		}
	}

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

	// For input textbox, so a user can press 'Enter' to generate data.
	function handle_keydown(event: any)
	{
		if (event.key === 'Enter' || event.code === 'Enter') {
			generate_info();
		}
	}
</script>

<div>
	<button id="recording_button" on:click={record_speech}><strong>Record</strong></button>
	<input type="text" id="words_text_box" placeholder="Type a word here, or press Record" on:keydown={handle_keydown}/>
	<button on:click={generate_info}><strong>Generate Info</strong></button>
	<div id="display_errors_here">
		<strong>Errors:</strong><br>
	</div>
	<div id="viseme_container"></div>
</div>

<style>
	button {
		margin: 5px;
		padding: 10px;
		background-color: #4285f4;
		color: #ffffff;
		border: 3px solid #0062ff;
		border-radius: 5px;
		cursor: pointer;
	}

	input[type='text'] {
		min-width: 300px;
		width: 30%;
		padding: 10px 10px;
		margin: 8px 0;
        border-radius: 10px;
	}

	#display_errors_here {
		margin: 5px;
		padding: 10px;
		background-color: #ffc6c6;
		color: #000000;
		border: 3px solid #ff0000;
		border-radius: 5px;
		width: fit-content;
		max-height: 120px;
		overflow-y: scroll;
		scrollbar-width: thin;
		scrollbar-color: rgb(255, 66, 66) rgb(255, 153, 153);
	}

	#viseme_container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>