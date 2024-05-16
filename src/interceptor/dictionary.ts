export const getTranslation = (key: string, lang: 'en'|'de'|'it'): string => {
    const commandDictionary = {
        de: {
            "hyper": "hyper",
            "seat": "sitz",
            "move": "bewegen",
            "forward": "vorwärts",
            "backward": "rückwärts",
            "centimeters": "zentimeter",
        },
        it: {
            "hyper": "hyper",
            "seat": "sedile",
            "move": "muovere",
            "forward": "avanti",
            "backward": "indietro",
            "centimeters": "centimetri"
        },
        en: {
            "hyper": "hyper",
            "seat": "seat",
            "move": "move",
            "forward": "forward",
            "backward": "backward",
            "centimeters": "centimeters"
        }
    } as any;

    if (commandDictionary[lang].hasOwnProperty(key)) {
        return commandDictionary[lang][key];
    }
    return key;
}