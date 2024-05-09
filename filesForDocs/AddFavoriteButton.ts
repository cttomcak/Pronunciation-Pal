import { onDestroy } from 'svelte';
import { userData } from './userData';

/** The word to be favorited */
export let word: string;

/** Whether the word has been added to favorites */
let favoriteAdded = false;
/** Array containing favorite words */
let favoriteWords: string | string[] = [];

/**
 * Function to unsubscribe from userData.
 */
const unsubscribe = userData.subscribe((value) => {
	favoriteWords = JSON.parse((value as any).favorite_words || '[]');
});

// Unsubscribe onDestroy
onDestroy(unsubscribe);

// On word change check if it's in favorites again
$: if (word) {
	checkIfInFavs();
}

/**
 * Checks if the word is in the list of favorite words.
 */
function checkIfInFavs() {
	if (favoriteWords.includes(word)) {
		favoriteAdded = true;
	} else {
		favoriteAdded = false;
	}
}

/**
 * Adds the word to favorites.
 */
async function addFavoriteWord() {
	const response = await fetch('/api/add-favorite-word', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ word: word })
	});

	if (response.ok) {
		console.log('Favorite word added successfully');
		favoriteAdded = true;
	} else {
		console.error('Failed to add favorite word');
	}
}
