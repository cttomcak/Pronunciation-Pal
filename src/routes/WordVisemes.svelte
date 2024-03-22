<script lang="ts">
    import { onMount } from "svelte";
	import VisemeImage from "./VisemeImage.svelte";
	import { phoneme_to_viseme_dict } from '../lib/PhonemeVisemeDict';
	import AudioPlayer from "$lib/AudioPlayer.svelte";

	export let word: string = '';
	export let definition: string = '';
	export let phonemes: string = '';
	export let pronunciation: string = '';

	let processed = phonemes;

	// Remove characters that we aren't using right now
	processed = processed.replaceAll('/', '');
	processed = processed.replaceAll('ˈ', '');
	processed = processed.replaceAll('(', '');
	processed = processed.replaceAll(')', '');
	processed = processed.replaceAll('[', '');
	processed = processed.replaceAll(']', '');
	processed = processed.replaceAll('ˌ', '');
	processed = processed.replaceAll('.', '');

	let visemes: string[] = [];
	let phonemesList: string[] = [];
	if (phonemes != 'No phonemes available')
	{
		for (let i = 0; i<processed.length; i++)
		{
			let viseme;

			// Case if the next phoneme is 2 characters
			if ((i != processed.length-1) && phoneme_to_viseme_dict[processed.substring(i, i+2)]) {
				viseme = phoneme_to_viseme_dict[processed.substring(i, i+2)];
				phonemesList.push(processed.substring(i, i+2));
				visemes.push(viseme);
				i += 1;
			}
			// Case if the next phoneme is 1 character
			else if (phoneme_to_viseme_dict[processed.substring(i, i+1)])
			{
				viseme = phoneme_to_viseme_dict[processed.substring(i, i+1)];
				phonemesList.push(processed.substring(i, i+1));
				visemes.push(viseme);
			}
			// We can't find the phoneme. Give error.
			else
			{
				console.error("UNMAPPED PHONEME CHARACTER: \"" + processed.substring(i, i+1) + "\"");
				console.error("Full phonemes = \"" + processed + "\"");
			}
		}
		console.log("Phonemes: " + processed + '\n' + "Visemes: " + visemes);
	}

    // Call the appendImages function when the component mounts
    onMount(appendImages);

    // This function is called when the component mounts
    function appendImages() {
        // Get the reference to the "pictures_go_here" div
        let picturesDiv = document.getElementById('pictures_go_here');

        if (picturesDiv) {
            // Loop through each viseme filename
            for (let i = 0; i < visemes.length; i++)
            {
				// Create a new instance of the VisemeImage component with the proper viseme and phoneme
                const visemeImage = new VisemeImage({
                    target: picturesDiv,
                    props: {
                        viseme: visemes[i],
						phoneme: phonemesList[i]
                    }
                });
            }
        }
    }
</script>

<div class="general_info">
	<div class="flex-column-center background-white">
		<!-- Display some other info about the word -->
		<div class="info-box">
			<div class="definition-box">
			<p><strong>{word.toUpperCase()}</strong></p>
			<p class="phonemes">{phonemes}</p>
			</div>
			<p>{definition}</p>
			{#if pronunciation}
				<p><AudioPlayer audioUrl={pronunciation} /></p>
			{:else}
				<p><strong>No pronunciation available</strong></p>
			{/if}
		</div>
		<!-- Where the viseme pictures go -->
		<div id="pictures_go_here"></div>
	</div>
</div>

<style>
	.general_info {
		margin-top: 2rem;
	}

	.flex-column-center {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.definition-box {
		display: flex;
		flex-direction: row;
	}
	.definition-box p {
		margin: 1rem 0 0 0;
	}
	.phonemes {
		margin-top: 1.8rem !important;
	}
	.definition-box strong {
		font-size: xx-large;
		margin-right: 1rem;
	}

	.background-white {
		background-color: white;
	}

    #pictures_go_here {
        display: flex; /* Display images side by side */
        flex-wrap: wrap; /* Wrap images to new row if necessary */
        justify-content: center; /* Center images horizontally */
    }
</style>
