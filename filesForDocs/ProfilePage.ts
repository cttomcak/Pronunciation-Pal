/** User data */
export let data;
/** New word, bound to the text entry box */
let newWord = '';

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
function handle_keydown(event: KeyboardEvent) {
	if (event.key === 'Enter' || event.code === 'Enter') {
		addFavoriteWord();
	}
}
