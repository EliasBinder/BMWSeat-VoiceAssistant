export const extractJson = (input: string) => {
    //Regex to match any JSON
    const regex = /{[^}]*}/g;
    const matches = input.match(regex);
    if (matches)
        return matches[0];
}