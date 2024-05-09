<!-- AudioPlayer.svelte -->
<script>
	/** Audio URL for word sound */
	export let audioUrl = '';

	/** Plays audio on webpage from given URL */
	function playAudio() {
		const audio = new Audio(audioUrl);
		audio.play();
	}
</script>

<button on:click={() => playAudio()}>Audio 🔊</button>

<style>
	button {
		margin: 5px;
		padding: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
