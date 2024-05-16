const commandDictionary = {
    de: {
        triggerword: ["hyper"],
        domain: ["sitz"],
        commandname: ["bewegen"],
        direction: ["vorwärts", "rückwärts"],
        unit: ["zentimeter, millimeter"],
    },
    it: {
        triggerword: ["hyper"],
        domain: ["sedile"],
        commandname: ["sposta"],
        direction: ["avanti", "indietro"],
        unit: ["centimetri, millimetri"],
    },
    en: {
        triggerword: ["hyper"],
        domain: ["seat"],
        commandname: ["move"],
        direction: ["forward", "backward"],
        unit: ["centimeters, millimeters"],
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

export const getLanguage = (msg: string): string => {
    const words = msg.split(" ");
    const domain = words[1];
    let lang = "en";
    Object.keys(commandDictionary).find(curLang => {
        if (commandDictionary[curLang].domain.includes(domain))
            lang = curLang;
    });
    return lang;
}