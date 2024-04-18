<script lang="ts">
	export let viseme: any;
	export let phoneme: any;
	export let showViseme: boolean;
	import { viseme_description_dict } from '$lib/PhonemeVisemeDict';
	import { phoneme_to_diagram_dict } from '$lib/PhonemeVisemeDict';
</script>

<div class="image_div">
	{#if showViseme}
		<!-- The viseme image -->
		<img src={`visemes/${viseme}.jpg`} class="viseme-image" alt={`Viseme ${viseme}`} />
		<!-- The angled viseme image -->
		<img src={`visemes/${viseme}45.jpg`} class="viseme-image" alt={`Viseme ${viseme} Angled`} />
	{:else}
		<!-- The diagram image -->
		<img
			src={`visemes/${phoneme_to_diagram_dict[phoneme]}.svg`}
			class="viseme-image"
			alt={`Viseme ${viseme}`}
		/>
	{/if}
	<h3 class="card-title">{viseme} - /{phoneme}/</h3>
	<p class="viseme-description">
		{viseme_description_dict[viseme]}
	</p>
</div>

<style>
	.card-title {
		text-align: center;
		margin: 10px 0 0 0;
	}
	.viseme-description::before {
		content: '• ';
	}
	.viseme-description {
		font-size: 0.8em;
		margin: 0 0 10px 10px;
	}
	.viseme-image {
		width: 100%; /* Set width of images */
		height: auto; /* Maintain aspect ratio */
	}

	.image_div {
		width: 15%;
		min-width: 200px;
		margin: 5px; /* Add some space between images */
		background-color: rgb(255, 255, 255);
		border-radius: 20px;
		background: #ffffff;
		box-shadow: 2px 4px 16px rgba(0, 0, 0, 0.123);
		padding: 10px;
	}
</style>
