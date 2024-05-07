<script>
	import WordSearch from "./WordSearch.svelte";
	import { userData } from "./userData";

	export let data;
	userData.set(data.user);
</script>

<svelte:head>
	<title>Pronunciation Pal</title>
</svelte:head>

<section>
	<WordSearch />
</section>

<style>
	section {
		width: 100%;
	}
</style>
