const config = require("./config.json");
const fetch = require('node-fetch');

(async () => {
  const { franc } = await import('franc');

  const commandDictionary = {
    de: {
      "hyper": "hyper",
      "sitz": "seat",
      "bewegen": "move",
      "vorwärts": "forward",
      "rückwärts": "backward",
      "zentimeter": "centimeters"
    },
    it: {
      "hyper": "hyper",
      "sedile": "seat",
      "muovere": "move",
      "avanti": "forward",
      "indietro": "backward",
      "centimetri": "centimeters"
    },
    fr: {
      "hyper": "hyper",
      "siège": "seat",
      "déplacer": "move",
      "avant": "forward",
      "arrière": "backward",
      "centimètres": "centimeters"
    }
  };

  const languageMapping = {
    deu: 'de',
    ita: 'it',
    fra: 'fr',
    eng: 'en'
  };

  const errorMessages = {
    en: "Please start by saying 'hyper', then say what you want to do, by how many centimeters, and in which direction (forward or backward). For example: 'hyper move seat 8 centimeters forward'.",
    de: "Bitte beginnen Sie mit 'hyper', dann sagen Sie, was Sie tun möchten, um wie viele Zentimeter und in welche Richtung (vorwärts oder rückwärts). Zum Beispiel: 'hyper Sitz bewegen 8 Zentimeter vorwärts'.",
    it: "Per favore inizia dicendo 'hyper', poi di' cosa vuoi fare, di quanti centimetri e in quale direzione (avanti o indietro). Per esempio: 'hyper sposta il sedile di 8 centimetri in avanti'.",
    fr: "Veuillez commencer par dire 'hyper', puis dites ce que vous voulez faire, de combien de centimètres et dans quelle direction (avant ou arrière). Par exemple: 'hyper déplacer le siège de 8 centimètres vers l'avant'."
  };

  const parseUnit = (unit) => {
    switch (unit) {
      case "zentimeter":
        return "cm";
      case "grad":
        return "angle";
      case "prozent":
        return "%";
      case "meter":
        return "m";
      case "millimeter":
        return "mm";
      default:
        return unit;
    }
  };

  const translateCommand = (command, lang) => {
    if (commandDictionary[lang]) {
      return command.map(word => commandDictionary[lang][word.toLowerCase().replace(/[.,]/g, '')] || word);
    }
    return command;
  };

  const getErrorMessage = (text) => {
    const lang = franc(text);
    const mappedLang = languageMapping[lang] || 'en';
    console.log("Detected language for error message: ", lang);
    console.log("Mapped language for error message: ", mappedLang);
    return errorMessages[mappedLang] || errorMessages['en'];
  };

  const intercept = async (msg, direction) => {
    const translateRaw = true; 

    if (msg.toLowerCase().startsWith("hyper")) {
      console.log("Intercepted: ", msg);
      const command = msg.split(" ");
      const lang = franc(msg);
      const mappedLang = languageMapping[lang] || 'en';
      console.log("Detected language: ", lang);
      console.log("Mapped language: ", mappedLang);
      const translatedCommand = translateCommand(command, mappedLang);

      const constructedJson = {
        triggerword: translatedCommand[0].toLowerCase(),
        domain: translatedCommand[1].toLowerCase(),
        commandname: translatedCommand[2].toLowerCase(),
        value: translatedCommand[3].toLowerCase(),
        unit: parseUnit(translatedCommand[4].toLowerCase()),
        direction: translatedCommand[5].toLowerCase(),
        raw: translateRaw ? translatedCommand.join(' ') : msg,
        origin: direction === 0 ? "driver" : "passenger",
        status_indicator: 200
      };

      console.log("Constructed JSON: ", JSON.stringify(constructedJson, null, 2));

      try {

        console.log("Sending request to:", 'http://10.30.51.150:8888/api/v5/hyper/commands');
        const response = await fetch('http://10.30.51.150:8888/api/v5/hyper/commands', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(constructedJson)
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        console.log("Response: ", jsonResponse);
        return true;
      } catch (e) {
        console.error("Error: ", e.message);
        return false;
      }
    } else {
      const errorMessage = getErrorMessage(msg);
      console.log(`Error: ${errorMessage}`);
      return false;
    }
  };

  const exampleText = "Hyper sitz bewegen 1 Zentimeter vorwärts.";
  intercept(exampleText, 0);
})();