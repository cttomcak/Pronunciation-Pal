<!-- +page.svelte -->
<script lang="ts">

	export let data;
    let newWord = "";

    async function addFavoriteWord() {
        const response = await fetch('/api/add-favorite-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: newWord })
        });

        if (response.ok) {
            // Optionally update UI or show success message
            console.log('Favorite word added successfully');
        } else {
            console.error('Failed to add favorite word');
        }
		
		window.location.reload();
    }

	async function deleteFavoriteWord(event: Event) {
		let word: string = (event.target as HTMLButtonElement).id;

		const response = await fetch('/api/delete-favorite-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word: word })
        });

        if (response.ok) {
            // Optionally update UI or show success message
            console.log('Favorite word deleted successfully');
        } else {
            console.error('Failed to delete favorite word');
        }
		
		window.location.reload();
	}
</script>

<section>
    <h1>Locked page, only accessible when logged in</h1>
    <h2>Hello, {data.user.first_name}</h2>
    <input type="text" bind:value={newWord} />
    <button on:click={addFavoriteWord}>Add Favorite Word</button>
    <h3>Favorite Words:</h3>
    <ul>
        {#each JSON.parse(data.user.favorite_words || '[]') as word}
            <li>{word} <button id={word} on:click={deleteFavoriteWord}>Remove</button></li>
        {/each}
    </ul>
    <form action="/auth?/logout" method="POST">
        <button type="submit">Logout</button>
    </form>
</section>
