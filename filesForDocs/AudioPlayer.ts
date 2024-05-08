/** Audio URL for word sound */
export let audioUrl = '';

/** Plays audio on webpage from given URL */
function playAudio() {
	const audio = new Audio(audioUrl);
	audio.play();
}
