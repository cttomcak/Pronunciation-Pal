<script lang="ts">
	import AudioPlayer from './AudioPlayer.svelte';

	export let word = '';
	export let definition = '';
	export let phonemes = '';
	export let pronunciation = '';
	export let diagrams = '';
</script>

<div class="info_card">
	<h3>{word.toUpperCase()}</h3>
	<p><strong>Definition:</strong> {definition}</p>
	<p><strong>Phonemes:</strong> {phonemes}</p>
	{#if pronunciation !== 'No pronunciation available'}
		<p><AudioPlayer audioUrl={pronunciation} /></p>
	{:else}
		<p><strong>{pronunciation}</strong></p>
	{/if}
	<p><strong>{diagrams}</strong></p>
</div>

<style>
	.info_card {
		border: 3px solid #4285f4;
		background-color: #dce8ff;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	}
</style>
