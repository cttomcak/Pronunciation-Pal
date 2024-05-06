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
            console.log('Favorite word deleted successfully');
        } else {
            console.error('Failed to delete favorite word');
        }
		
		window.location.reload();
	}

    /**
     * Handles keydown event for input textbox.
     * @param {KeyboardEvent} event - The keydown event object.
     */
	function handle_keydown(event: KeyboardEvent)
	{
		if (event.key === 'Enter' || event.code === 'Enter') {
			addFavoriteWord();
		}
	}
</script>

<section>
    <h1>Profile Page</h1>
    <h2>Hello, {data.user.first_name}</h2>
    <input type="text" bind:value={newWord} on:keydown={handle_keydown}/>
    <button on:click={addFavoriteWord}>Add Favorite Word</button>
    <h3>Favorite Words:</h3>
    <ul>
        {#each JSON.parse(data.user.favorite_words || '[]') as word}
            <li>{word.charAt(0).toUpperCase() + word.slice(1)} <button id={word} on:click={deleteFavoriteWord}>Remove</button></li>
        {/each}
    </ul>
    <form action="/auth?/logout" method="POST">
        <button type="submit">Logout</button>
    </form>
</section>
