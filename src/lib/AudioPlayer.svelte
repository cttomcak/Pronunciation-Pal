<!-- AudioPlayer.svelte -->
<script>
	export let audioUrl = '';

	function playAudio() {
		const audio = new Audio(audioUrl);
		audio.play();
	}
</script>

<button on:click={() => playAudio()}>Official Pronunciation</button>

<style>
	button {
		padding: 5px;
		background-color: #4285f4;
		color: #ffffff;
		border: 3px solid #0062ff;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
