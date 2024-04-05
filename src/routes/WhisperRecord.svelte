<script lang="ts">
    import { createEventDispatcher } from 'svelte';

	let mediaRecorder: any;
	let chunks: any = [];
	let transcription = '';
	let recording = false;

	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.addEventListener('dataavailable', (event: { data: any }) => {
				chunks.push(event.data);
			});

			mediaRecorder.addEventListener('stop', async () => {
				const audioBlob = new Blob(chunks, { type: 'audio/wav' });
				const formData = new FormData();
				formData.append('file', audioBlob);

				try {
					const response = await fetch('http://localhost:3000/transcribe', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						const data = await response.json();
						transcription = data.transcription;
                        set_parent_text();
					} else {
						alert('Error: ' + response.statusText);
					}
				} catch (error) {
					console.error('Error:', error);
					alert('An error occurred. Please try again.');
				}
			});

			mediaRecorder.start();
			recording = true;
		} catch (error) {
			console.error('Error starting recording:', error);
			alert('An error occurred. Please try again.');
		}
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			chunks = [];
			recording = false;
		}
	}

	async function submitForm(event: any) {
		event.preventDefault();

		const formData = new FormData(event.target);

		try {
			const response = await fetch('http://localhost:3000/transcribe', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				transcription = data.transcription;
                set_parent_text();
			} else {
				alert('Error: ' + response.statusText);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		}
	}

    const dispatch = createEventDispatcher();

	// Sends an event to the parent component to set the search bar text
	function set_parent_text() {
        transcription = transcription.replaceAll('.', '');
		transcription = transcription.replaceAll(',', '');
		dispatch('set_parent_text', {transcription});
	}
</script>

<div class="record-buttons">
	<form on:submit={submitForm} enctype="multipart/form-data">
		<input type="file" name="file" accept="audio/*" required />
		<button type="submit">Transcribe File</button>
	</form>
	{#if !recording}
	<button on:click={startRecording}>Record (Whisper AI)</button>
	{:else}
	<button id="while_recording" on:click={stopRecording}><strong>Stop Recording</strong></button>
	{/if}
</div>

<style>
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
	input::file-selector-button {
		margin: 5px;
		padding: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 5px;
		cursor: pointer;
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	#while_recording {
		background-color: #e233e5;
		border: 3px solid #9e0077;
	}
</style>