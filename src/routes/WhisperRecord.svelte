<script lang="ts">
    import { createEventDispatcher } from 'svelte';

	/** MediaRecorder Object */
    let mediaRecorder: MediaRecorder | null;
	/** Stores audio chunks */
    let chunks: BlobPart[] = [];
	/** Resulting transcription from Whisper */
    let transcription = '';
	/** Boolean to track whether we're recording or not */
    let recording = false;
	/** File input element */
	let fileInput: HTMLInputElement | null;

	/**
     * Starts recording audio from the user's microphone.
     * @returns {Promise<void>} Void
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
					const response = await fetch('/api/transcribe', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						const data = await response.json();
						transcription = data.text;
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

	/**
     * Submits form data for transcription.
     * @param {Event} event - The form submission event.
     * @returns {Promise<void>} Void
     */
	async function submitForm(event: any) {
		event.preventDefault();

		const formData = new FormData(event.target.form as HTMLFormElement);

		if ((formData.get("file") as File).name.length > 0)
		{
			try {
			const response = await fetch('/api/transcribe', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const data = await response.json();
				transcription = data.text;
                set_parent_text();
			} else {
				alert('Error: ' + response.statusText);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred. Please try again.');
		}
		}
	}

    const dispatch = createEventDispatcher();

	/**
     * Sends an event to the parent component to set the search bar text.
     */
	function set_parent_text() {
        transcription = transcription.replaceAll(/[\.,]/g, '');
		dispatch('set_parent_text', {transcription});
	}
</script>

<div class="record-buttons">
	<form enctype="multipart/form-data">
		<input bind:this={fileInput} on:change={submitForm} type="file" name="file" accept="audio/*" style="display: none;" />
	</form>
	<button on:click={() => fileInput && fileInput.click()}>Transcribe File</button>
	{#if !recording}
	<button on:click={startRecording}>Record (Whisper AI)</button>
	{:else}
	<button id="while_recording" on:click={stopRecording}><strong>Stop Recording</strong></button>
	{/if}
</div>

<style>
	.record-buttons {
		display: flex;
		flex-direction: row;
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