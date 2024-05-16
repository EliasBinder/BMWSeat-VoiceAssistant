export const calculateSimilarity = (a: string, b: string) => {
    // Calculate similarity percentage
    const similarity = calculateLevenshteinDistance(a, b);
    var similarityPercentage = similarityToPercentage(similarity, a.length, b.length);
    
    return similarityPercentage;
}

const calculateLevenshteinDistance = (phrase1: string, phrase2: string) => {
    // Levenshtein Distance calculation
    var distance: any[] = [];
    for (var i = 0; i <= phrase1.length; i++) {
        distance[i] = [];
        distance[i][0] = i;
    }
    for (var j = 0; j <= phrase2.length; j++) {
        distance[0][j] = j;
    }
    for (var i = 1; i <= phrase1.length; i++) {
        for (var j = 1; j <= phrase2.length; j++) {
            var cost = (phrase1.charAt(i - 1) === phrase2.charAt(j - 1)) ? 0 : 1;
            distance[i][j] = Math.min(
                distance[i - 1][j] + 1,         // Deletion
                distance[i][j - 1] + 1,         // Insertion
                distance[i - 1][j - 1] + cost   // Substitution
            );
        }
    }
    return distance[phrase1.length][phrase2.length];
}

const similarityToPercentage = (similarity: any, aLen: number, bLen: number) => {
    var maxLength = Math.max(aLen, bLen);
    var percentage = ((maxLength - similarity) / maxLength) * 100;
    return percentage;
}