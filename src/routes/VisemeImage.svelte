<script lang="ts">
	export let viseme: string[];
	export let phoneme: string;
	export let showViseme: boolean;
	import { viseme_description_dict } from '$lib/PhonemeVisemeDict';
	import { phoneme_to_diagram_dict } from '$lib/PhonemeVisemeDict';
</script>

<div class="image_div length{viseme.length}">
	<div class="images">
		{#if showViseme}
			{#each viseme as vis}
				<div>
					<!-- The viseme image -->
					<img src={`visemes/${vis}.jpg`} class="viseme-image" alt={`Viseme ${vis}`} />
					<!-- The angled viseme image -->
					<img src={`visemes/${vis}45.jpg`} class="viseme-image" alt={`Viseme ${vis} Angled`} />
				</div>
			{/each}
		{:else}
			<!-- The diagram image -->
			{#each phoneme_to_diagram_dict[phoneme].split(',') as diagram}
				<div>
					<img src={`visemes/${diagram}.svg`} class="viseme-image" alt={`Viseme ${viseme}`} />
				</div>
			{/each}
		{/if}
	</div>
	<h3 class="card-title">{viseme} - /{phoneme}/</h3>
	{#each viseme as vis}
		<p class="viseme-description">
			{viseme_description_dict[vis]}
		</p>
	{/each}
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
		margin: 0 0 0 15px;
	}
	.viseme-image {
		width: 100%; /* Set width of images */
		height: auto; /* Maintain aspect ratio */
	}
	.image_div {
		margin: 5px; /* Add some space between images */
		background-color: rgb(255, 255, 255);
		border-radius: 20px;
		background: #ffffff;
		box-shadow: 2px 2px 16px 2px rgba(0, 0, 0, 0.25);
		padding: 10px;
	}
	.length1 {
		width: 15%;
		min-width: 200px;
	}
	.length2 {
		width: 30%;
		min-width: 400px;
		text-align: center;
	}
	.images {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
</style>
