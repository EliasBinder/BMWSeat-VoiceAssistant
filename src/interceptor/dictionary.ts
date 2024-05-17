import { calculateSimilarity } from "./similarity";

const unitAbbreviations = ["cm", "mm", "°", "%"];
const commandDictionary = {
    de: {
        triggerword: ["hyper"],
        domain: ["sitz", "lehne", "vacust", "inklination", "system"],
        commandname: ["bewegen", "funktion", "execute"],
        direction: ["vorwärts", "rückwärts", "hoch", "runter"],
        unit: ["zentimeter", "millimeter", "grad", "prozent", "ticks", "starten", ...unitAbbreviations],
    },
    it: {
        triggerword: ["hyper"],
        domain: ["sedile", "schienale", "vacust", "inclinazione", "system"],
        commandname: ["sposta", "funzione", "execute"],
        direction: ["avanti", "indietro", "su", "giù"],
        unit: ["centimetri", "millimetri", "grado", "percentuale", "ticks", "iniziare", ...unitAbbreviations],
    },
    en: {
        triggerword: ["hyper"],
        domain: ["seat", "backrest", "vacust", "system"],
        commandname: ["move", "start", "function", "incline", "execute"],
        direction: ["forward", "backward", "up", "down"],
        unit: ["centimeters", "millimeters", "degree", "percent", "ticks", "start", ...unitAbbreviations],
    }
} as any;

export const getTranslation = (key: string, language: string, section: string): string => {
    if (commandDictionary[language][section].includes(key)){
        const index = commandDictionary[language][section].indexOf(key);
        return commandDictionary.en[section][index];
    } else {
        let mostLikely = key;
        let mostLikelyPercentage = 0;
        commandDictionary[language][section].forEach((element: string) => {
            let similarity = calculateSimilarity(element, key);
            console.log("Similarity between ", element, " and ", key, " is ", similarity);
            if (similarity > mostLikelyPercentage) {
                mostLikelyPercentage = similarity;
                mostLikely = element;
            }
        });
        return mostLikely;
    }
}
