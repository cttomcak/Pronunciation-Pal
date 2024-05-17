
export function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create a 2D array to store distances
    const distances = Array(len1 + 1)
      .fill(0)
      .map(a => Array(len2 + 1).fill(0));

    // Initialize the first row and column
    for (let i = 0; i <= len1; i++) {
        distances[i][0] = i;
    }
    for (let j = 0; j <= len2; j++) {
        distances[0][j] = j;
    }

    // Calculate the distances
    for (let j = 1; j <= len2; j++) {
        for (let i = 1; i <= len1; i++) {
            const cost = str1.charAt(i - 1) === str2.charAt(j - 1) ? 0 : 1;
            distances[i][j] = Math.min(
                distances[i - 1][j] + 1, // del
                distances[i][j - 1] + 1, // ins
                distances[i - 1][j - 1] + cost // sub
            );
        }
    }

    // Do backtracking to find the operations
    const operations = [];
    let i = len1;
    let j = len2;
    while (i > 0 || j > 0) {
        if (i > 0 && distances[i][j] == distances[i - 1][j] + 1) {
            console.log(`Delete '${str1[i - 1]}' from position ${i}`);
            operations.unshift({
                type: 'delete',
                from: str1[i - 1],
                to: "",
                position: i
            });
            i--;
        } else if (j > 0 && distances[i][j] == distances[i][j - 1] + 1) {
            console.log(`Insert '${str2[j - 1]}' at position ${i}`);
            operations.unshift({
                type: 'insert',
                from: "",
                to: str2[j - 1],
                position: i
            });
            j--;
        } else if (i > 0 && j > 0) {
            if (distances[i][j] == distances[i - 1][j - 1] + 1) {
                console.log(`Substitute '${str1[i - 1]}' at position ${i} with '${str2[j - 1]}'`);
                operations.unshift({
                    type: 'substitute',
                    from: str1[i - 1],
                    to: str2[j - 1],
                    position: i
                });
            }
            i--;
            j--;
        }
    }

    // Return the Levenshtein distance
    return operations;
}
