<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AudioPlayer from '$lib/AudioPlayer.svelte';

	export let word = '';
	export let definition = '';
	export let phonemes = '';
	export let pronunciation = '';
	export let diagrams = '';

	const dispatch = createEventDispatcher();

	/** Sends an event to the parent component to delete the card */
	function remove_card() {
		dispatch('remove', { word });
	}
</script>

<div class="info_card">
	<div class="header">
		<h3>{word.toUpperCase()}</h3>
		<button class="delete_button" on:click={remove_card}><strong>Delete Card</strong></button>
	</div>
	<p><strong>Definition:</strong> {definition}</p>
	<p><strong>Phonemes:</strong> {phonemes}</p>
	{#if pronunciation}
		<p><AudioPlayer audioUrl={pronunciation} /></p>
	{:else}
		<p><strong>No pronunciation available</strong></p>
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
		max-width: 30%;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.delete_button {
		padding: 4px;
		background-color: #f9b8ff;
		color: #000000;
		border: 2px solid #e100ff;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
