import { levenshteinDistance } from '$lib/Levenshtein.js';
import { vowel_list, phoneme_vowel_dict } from '$lib/PhonemeVowelDict.ts';

/**
 * @param {string} str1 
 * @param {string} str2 
 * @returns {string}
 */
export function generateFeedback(str1, str2) {
    var feedback = `You said: /${str1}/.\nThe word is pronounced: /${str2}/.\n\n`;
	const diff = levenshteinDistance(str1, str2);
    for (var op of diff) {
        console.log(op);
        switch (op.type) {
            case 'delete':
                feedback = feedback.concat(`Remove the /${op.from}/ after the /${str1.charAt(op.position - 2)}/.\n`);
                console.log(`Remove the /${op.from}/ after the /${str1.charAt(op.position)}/.`);
                break;
            case 'insert':
                feedback = feedback.concat(`Add a /${op.to}/ after the /${str1.charAt(op.position - 2)}/.\n`);
                console.log(`Add a /${op.to}/ after the /${str1.charAt(op.position)}/.`);
                break;
            case 'substitute':
                if (vowel_list.includes(op.from) && vowel_list.includes(op.to)) {
                    let v1 = phoneme_vowel_dict[op.from];
                    let v2 = phoneme_vowel_dict[op.to];
                    feedback = feedback.concat(`Change the vowel from /${op.from}/ to /${op.to}/.\n`);
                    console.log(`Change the vowel from /${op.from}/ to /${op.to}/.`);
                    switch (v2.tongue - v1.tongue) {
                        case 0:
                            feedback = feedback.concat(`Keep the tongue in the same position. `);
                            break;
                        case 1: case 2:
                            feedback = feedback.concat(`Move the tongue back slightly. `);
                            break;
                        case -1: case -2:
                            feedback = feedback.concat(`Move the tongue forward slightly. `);
                            break;
                        case 3: case 4:
                            feedback = feedback.concat(`Move the tongue back. `);
                            break;
                        case -3: case -4:
                            feedback = feedback.concat(`Move the tongue forward. `);
                            break;
                        case 5: case 6:
                            feedback = feedback.concat(`Move the tongue back a lot. `);
                            break;
                        case -5: case -6:
                            feedback = feedback.concat(`Move the tongue forward a lot. `);
                            break;
                    }
                    switch (v2.jaw - v1.jaw) {
                        case 0:
                            feedback = feedback.concat(`Keep the jaw in the same position. `);
                            break;
                        case 1: case 2:
                            feedback = feedback.concat(`Move the jaw up slightly. `);
                            break;
                        case -1: case -2:
                            feedback = feedback.concat(`Move the jaw down slightly. `);
                            break;
                        case 3: case 4:
                            feedback = feedback.concat(`Move the jaw up. `);
                            break;
                        case -3: case -4:
                            feedback = feedback.concat(`Move the jaw down. `);
                            break;
                        case 5: case 6:
                            feedback = feedback.concat(`Move the jaw up a lot. `);
                            break;
                    }
                    if (v2.rounded && !v1.rounded) {
                        feedback = feedback.concat(`Round the lips. `);
                    }
                    feedback = feedback.concat('\n');
                }
                else {
                    feedback = feedback.concat('Unable to give feedback on substituted consonants.\n');
                }
                break;
        }
    }
    return feedback;
}
/*
                operations.unshift({
                    type: 'substitute',
                    from: str1[i - 1],
                    to: str2[j - 1],
                    position: i
                });
                */