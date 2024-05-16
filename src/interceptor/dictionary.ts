const commandDictionary = {
    de: {
        triggerword: ["hyper"],
        domain: ["sitz", "lehne"],
        commandname: ["bewegen"],
        direction: ["vorwärts", "rückwärts", "hoch", "runter"],
        unit: ["zentimeter, millimeter", "grad", "prozent", "ticks"],
    },
    it: {
        triggerword: ["hyper"],
        domain: ["sedile", "schienale"],
        commandname: ["sposta"],
        direction: ["avanti", "indietro", "su", "giù"],
        unit: ["centimetri, millimetri", "grado", "percentuale", "ticks"],
    },
    en: {
        triggerword: ["hyper"],
        domain: ["seat", "backrest"],
        commandname: ["move"],
        direction: ["forward", "backward", "up", "down"],
        unit: ["centimeters, millimeters", "degree", "percent", "ticks"],
    }
} as any;

export const getTranslation = (key: string): string => {
    for (let lang in commandDictionary){
        for (let section in commandDictionary[lang]){
            if (commandDictionary[lang][section].includes(key)){
                const index = commandDictionary[lang][section].indexOf(key);
                return commandDictionary.en[section][index];
            }
        }
    }
    return key;
}