<script lang="ts">

    /** User data */
	export let data;
    /** New word, bound to the text entry box */
    let newWord = "";

    /**
     * Adds favorite word for the user.
     */
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

    /**
     * Deletes favorite word for the user.
     * @param event - Button press event object.
     */
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
    <h1>Hello, {data.user.first_name.charAt(0).toUpperCase() + data.user.first_name.slice(1)}</h1>
    <div class="search">
        <input type="text" bind:value={newWord} on:keydown={handle_keydown} placeholder="Favorite"/>
        <button class="favorite-button" on:click={addFavoriteWord}>Add Favorite Word</button>
    </div>
    {#if JSON.parse(data.user.favorite_words || '[]').length > 0}
    <div class="favorites-box">
        <h3>Favorite Words:</h3>
        <ul>
            {#each JSON.parse(data.user.favorite_words || '[]') as word}
                <li><p>{word.charAt(0).toUpperCase() + word.slice(1)}</p>
                    <button class="close-button" aria-label="Close" id={word} on:click={deleteFavoriteWord}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30px" height="30px"><path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/></svg>
                    </button>
                </li>
            {/each}
        </ul>
    </div>
    {/if}
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    * {
        box-sizing: border-box;
        font-family: Poppins, sans-serif;
    }
    .search {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
	input {
		width: 100%;
		height: 40px;
		line-height: 28px;
		padding: 0 1rem;
		padding-left: 2.5rem;
		border: 2px solid black;
		border-radius: 50px;
		background-color: #ffffff;
		color: #0d0c22;
		transition: .3s ease;
        max-width: 400px;
	}
	.favorite-button {
		margin: 2px;
        margin-left: 20px;
		padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
		background-color: #4942E4;
		color: #ffffff;
		border: 3px solid #11009E;
		border-radius: 4px;
		cursor: pointer;
        min-width: fit-content;
	}
    .favorites-box {
        background-color: white;
        padding: 15px;
        margin-top: 20px;
        border-radius: 10px;
        box-shadow: 2px 2px 16px 2px rgba(0, 0, 0, 0.15);
    }
    ul {
        display: flex;
        flex-direction: column;
        padding: 0;
    }
    li {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0;
        justify-content: space-between;
        width: 700px;
        height: 30px;
    }
    li:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    li > p {
        margin: 0;
        margin-left: 10px;
        padding: 0;
        font-size: 1rem;
    }
    li > button {
		padding: 2px;
		margin: 0;
		border: none;
        background: none;
		font-size: 1.5rem;
		color: rgba(114, 114, 114, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
	}
    li > button > svg {
        fill: rgba(114, 114, 114, 0.5);
		transition: cubic-bezier(1, 0, 0, 1) 0.3s;
        pointer-events: none;
    }

	li > button:hover > svg {
		fill: red;
	}
</style>