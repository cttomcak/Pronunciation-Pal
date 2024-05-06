<script>
	import WordEntry from "./WordEntry.svelte"
	import { userData } from "./userData";

	export let data;
	userData.set(data.user);
</script>

<svelte:head>
	<title>Speech Animation</title>
</svelte:head>

<section>
	<WordEntry />
</section>

<style>

</style>
