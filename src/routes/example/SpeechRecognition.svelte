<script lang="ts">
	import InfoCard from './InfoCard.svelte';

	let recognizer: any;
	let generated_words: string[] = [];

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
		let card_div = document.getElementById('info_cards_container');
		let error_box = document.getElementById("display_errors_here");

		if (words_text_box && card_div && error_box) {
			let words_list = words_text_box.value.split(' ');

			for (let i = 0; i < words_list.length; i++) {
				if (generated_words.includes(words_list[i]))
				{
					error_box.innerHTML += `Already generated results for ${words_list[i]}<br>`;
					continue;
				}
				generated_words.push(words_list[i]);

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
		const phonemes = data[0]?.phonetics[0]?.text || 'No phonemes available';
		const pronunciation = data[0]?.phonetics[0]?.audio || 'No pronunciation available';
		const diagrams = 'href to diagrams or something idk';

		// Dynamically create InfoCard component and add it to info_cards_container
		let infoCardsContainer = document.getElementById('info_cards_container');
		if (infoCardsContainer) {
			let infoCardComponent = new InfoCard({
				target: infoCardsContainer,
				props: {
					word,
					definition,
					phonemes,
					pronunciation,
					diagrams
				}
			});
		}
	}
</script>

<body>
	<button id="recording_button" on:click={record_speech}><strong>Record</strong></button>
	<input type="text" id="words_text_box" placeholder="Type words here, or press Record" />
	<button on:click={generate_info}><strong>Generate Info</strong></button>
	<div id="display_errors_here">
		<strong>Errors:</strong><br>
	</div>
	<div id="info_cards_container"></div>
</body>

<style>
	body {
		font-family: 'Arial', sans-serif;
	}

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
		min-width: 220px;
		width: 30%;
		padding: 10px 10px;
		margin: 8px 0;
		/* box-sizing: border-box; */
	}

	#display_errors_here {
		margin: 5px;
		padding: 10px;
		background-color: #ffc6c6;
		color: #000000;
		border: 3px solid #ff0000;
		border-radius: 5px;
		/* min-width: 200px; */
		width: fit-content;
	}

	#info_cards_container {
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
	}
</style>
