export type PhonemeVowelInfo = {
    jaw: number,
    tongue: number,
    rounded: boolean,
}

export const vowel_list = ["i","y","ɨ","ʉ","ɯ","u","ɪ","ʏ","ʊ","e","ø","ɘ","ɵ","ɤ","o","ə","ɛ","œ","ɜ","ɞ","ʌ","ɔ","æ","ɐ","a","ɶ","ɑ","ɒ"]

export const phoneme_vowel_dict: { [id: string] : PhonemeVowelInfo } = {
    "i": { jaw: 0, tongue: 0, rounded: false },
    "y": { jaw: 0, tongue: 0, rounded: true },
    "ɨ": { jaw: 0, tongue: 3, rounded: false },
    "ʉ": { jaw: 0, tongue: 3, rounded: true },
    "ɯ": { jaw: 0, tongue: 6, rounded: false },
    "u": { jaw: 0, tongue: 6, rounded: true },
    "ɪ": { jaw: 1, tongue: 1, rounded: false },
    "ʏ": { jaw: 1, tongue: 1, rounded: false },
    "ʊ": { jaw: 1, tongue: 5, rounded: false },
    "e": { jaw: 2, tongue: 1, rounded: false },
    "ø": { jaw: 2, tongue: 1, rounded: true },
    "ɘ": { jaw: 2, tongue: 3, rounded: false },
    "ɵ": { jaw: 2, tongue: 3, rounded: true },
    "ɤ": { jaw: 2, tongue: 6, rounded: false },
    "o": { jaw: 2, tongue: 6, rounded: true },
    "ə": { jaw: 3, tongue: 4, rounded: false },
    "ɛ": { jaw: 4, tongue: 2, rounded: false },
    "œ": { jaw: 4, tongue: 2, rounded: true },
    "ɜ": { jaw: 4, tongue: 4, rounded: false },
    "ɞ": { jaw: 4, tongue: 4, rounded: true },
    "ʌ": { jaw: 4, tongue: 6, rounded: false },
    "ɔ": { jaw: 4, tongue: 6, rounded: true },
    "æ": { jaw: 5, tongue: 2, rounded: false },
    "ɐ": { jaw: 5, tongue: 4, rounded: false },
    "a": { jaw: 6, tongue: 3, rounded: false },
    "ɶ": { jaw: 6, tongue: 3, rounded: true },
    "ɑ": { jaw: 6, tongue: 6, rounded: false },
    "ɒ": { jaw: 6, tongue: 6, rounded: true },
}