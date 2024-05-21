
import { calculateSimilarity } from "./similarity";

const unitAbbreviations = ["cm", "mm", "°", "%"];

const commandDictionary = {
  de: {
    triggerword: ["hyper"],
    domain: ["sitz", "lehne", "vacust", "inklination", "system"],
    commandname: ["bewegen", "funktion", "execute"],
    direction: ["vorwärts", "rückwärts", "hoch", "runter", "starten"],
    unit: [
      "zentimeter",
      "millimeter",
      "grad",
      "prozent",
      "ticks",
      "parken",
      "kleines",
      "mittleres",
      "komfort",
      "sport",
      "lendenwirbel",
      ...unitAbbreviations
    ],
  },
  it: {
    triggerword: ["hyper"],
    domain: ["sedile", "schienale", "vacust", "inclinazione", "system"],
    commandname: ["sposta", "funzione", "execute"],
    direction: ["avanti", "indietro", "su", "giù", "iniziare"],
    unit: [
      "centimetri",
      "millimetri",
      "grado",
      "percentuale",
      "ticks",
      "parcheggio",
      "piccolo",
      "medio",
      "comfort",
      "sport",
      "lombare",
      ...unitAbbreviations
    ],
  },
  en: {
    triggerword: ["hyper"],
    domain: ["seat", "backrest", "vacust", "system"],
    commandname: ["move", "function", "incline", "execute"],
    direction: ["forward", "backward", "up", "down", "start"],
    unit: [
      "centimeters",
      "millimeters",
      "degree",
      "percent",
      "ticks",
      "parking",
      "small",
      "medium",
      "comfort",
      "sport",
      "lumbar",
      ...unitAbbreviations
    ],
  }
} as any;

export const getTranslation = (key: string, language: string, section: string): string => {
  if (commandDictionary[language][section].includes(key)) {
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
};
