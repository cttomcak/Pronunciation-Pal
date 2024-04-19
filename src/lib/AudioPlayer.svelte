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
		margin: 5px;
		padding: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
