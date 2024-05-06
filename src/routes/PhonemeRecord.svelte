<script lang="ts">
    import { createEventDispatcher } from 'svelte';

	// Declaring variables for media recording
    let mediaRecorder: MediaRecorder | null;
    let chunks: BlobPart[] = [];
    let phonemes = '';
    let recording = false;

	/**
     * Starts recording audio from the user's microphone.
     * @returns {Promise<void>}
     */
	async function startRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.addEventListener('dataavailable', (event: { data: BlobPart }) => {
				chunks.push(event.data);
			});

			mediaRecorder.addEventListener('stop', async () => {
				const audioBlob = new Blob(chunks, { type: 'audio/wav' });
				const formData = new FormData();
				formData.append('file', audioBlob);

				try {
					const response = await fetch('http://localhost:5000/api/phonemes', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						phonemes = await response.text();
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

	/**
     * Stops recording audio.
     */
	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
			chunks = [];
			recording = false;
		}
	}

    const dispatch = createEventDispatcher();

	/**
     * Sends an event to the parent component to set the search bar text.
     */
	$: dispatch('newPhonemes', {phonemes});
</script>

<div class="record-buttons">
	{#if !recording}
	<button on:click={startRecording}>Phoneme Analysis</button>
	{:else}
	<button class="recording" on:click={stopRecording}><strong>Stop Recording</strong></button>
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
	.recording {
		background-color: #e233e5;
		border: 3px solid #9e0077;
	}
</style>