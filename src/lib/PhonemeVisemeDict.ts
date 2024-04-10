// This is the current mapping of IPA phoneme symbols to visemes (in static).
// I think it's pretty accurate, but change it if there's a problem and leave a comment.
//
// If you ever get an error in the console saying "UNMAPPED PHONEME CHARACTER" you need
// to figure out what it is and add it to the dictionary with the proper viseme mapping (ask chad).
//
// The API returns a lot of differing unicode characters for equivelant or similar phonemes.
export const phoneme_to_viseme_dict: { [id: string] : string; } = {
    "p" : "PP",
    "b" : "PP",
    "t" : "DD",
    "d" : "DD",
    "ɾ" : "DD",
    "k" : "kk",
    "g" : "kk",
    "ɡ" : "kk",
    "f" : "FF",
    "v" : "FF",
    "θ" : "TH",
    "ð" : "TH",
    "s" : "SS",
    "z" : "SS",
    "ʃ" : "CH",
    "ʒ" : "CH",
    "h" : "CH",
    "m" : "PP",
    "n" : "nn",
    "ŋ" : "nn",
    "l" : "nn",
    "r" : "RR",
    "ɚ" : "RR",
    "ɹ" : "RR",
    "j" : "I",
    "w" : "U",
    "ɪ" : "I",
    "ɨ" : "E",
    "e" : "E",
    "æ" : "aa",
    "a" : "aa",
    "ɒ" : "O",
    "ʌ" : "U",
    "ʊ" : "U",
    "ə" : "E", // Changed from sil to E
    "ɜ" : "E",
    "ɛ" : "E",
    "ɔ" : "O",
    "ɑ" : "aa",
    "ɑː" : "aa",
    "ʉː" : "U",
    "i" : "I",
    "iː" : "I",
    "ɜː" : "E",
    "uː" : "U",
    "ɔː" : "O",
    "eɪ" : "E",
    "aɪ" : "aa",
    "ɔɪ" : "O",
    "aʊ" : "O",
    "əʊ" : "O",
    "ɪə" : "I",
    "eə" : "E",
    "ʊə" : "U",
    "tʃ" : "CH",
    "dʒ" : "CH",
    "oʊ" : "O",
};

// Description of the 15 visemes that I have.
// Most sources say there's only 10-16 meaningfully different visemes.
// I think this collection is pretty good.
export const viseme_description_dict: { [id: string] : string; } = {
    "aa" : "Wide, open mouth shape",
    "CH" : "Spread lip position, resembling 'sh'",
    "DD" : "Sudden release of tongue from roof of mouth",
    "E" : "Neutral mouth position with mid-level tongue",
    "FF" : "Upper teeth touching lower lip, creating friction",
    "I" : "Relatively closed mouth with raised tongue",
    "kk" : "Strong closure of back of tongue against soft palate",
    "nn" : "Nasalized sound with closure of soft palate",
    "O" : "Rounded lip shape with partially open mouth",
    "PP" : "Complete closure of lips with pressure buildup",
    "RR" : "Slight constriction of tongue with lips slightly apart",
    "sil" : "Silence or neutral mouth position",
    "SS" : "Narrow opening between upper and lower teeth, frictional airflow",
    "TH" : "Tongue between or near teeth, creating fricative sound",
    "U" : "Rounded lip shape with relatively open mouth"
};