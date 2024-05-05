<script lang='ts'>
	import { onDestroy } from 'svelte';
    import { userData } from './userData';

    export let word: string;
    let word_safe = word

    let favoriteAdded = false;

    const unsubscribe = userData.subscribe(value => {
        console.log("word at this time:", word_safe, word);
        if (JSON.parse((value as any).favorite_words || '[]').includes(word_safe)) {
            favoriteAdded = true;
        }
    });

	onDestroy(unsubscribe);

    async function addFavoriteWord() {
        const response = await fetch('/api/add-favorite-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: word_safe })
        });

        if (response.ok) {
            console.log('Favorite word added successfully');
            favoriteAdded = true;
        } else {
            console.error('Failed to add favorite word');
        }
    }
</script>
<div>
    {#if favoriteAdded}
        <button disabled>Favorited ✔</button>
    {:else}
        <button on:click={addFavoriteWord}>Favorite "{word_safe}"</button>
    {/if}
    word during processing = {word_safe}
</div>

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
    button:disabled {
		margin: 5px;
		padding: 10px;
		background-color: #231f69;
		color: #ffffff94;
		border: 3px solid #000000;
		border-radius: 5px;
		cursor: pointer;
	}
</style>