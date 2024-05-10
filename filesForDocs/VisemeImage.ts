/** The viseme to determine which images we use */
export let viseme: string[];
/** The phoneme for selecting speech-sound diagram(s) */
export let phoneme: string;
/** Whether we show visemes or the diagram */
export let showViseme: boolean;
import { viseme_description_dict } from '$lib/PhonemeVisemeDict';
import { phoneme_to_diagram_dict } from '$lib/PhonemeVisemeDict';