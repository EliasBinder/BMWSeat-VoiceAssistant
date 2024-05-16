
import config from "../../config.json";
import { getErrorMsg } from "./error-messages";
import { say } from "../text-to-speech/textToSpeech";
import { getLanguage, getTranslation } from "./dictionary";

export const intercept = (msg: string, language: string, direction: number): boolean => {
    msg = msg.replace(/!|\?|\./g, ''); 

    if (msg.toLowerCase().startsWith("hyper")){
        console.log("Intercepted: ", msg);

        if (language != "en" && language != "de" && language != "it")
            language = "en";

        //Ugly fix for german language
        if (msg.toLowerCase().startsWith("hypersitz")) {
            msg = msg.toLocaleLowerCase().replace("hypersitz", "hyper sitz");
        }

        const command = msg.split(" ");
        console.log("Command: ", command);

        if (command.length != 6) {
            const errorMessage = getErrorMsg(language as any);
            console.log("Error: Invalid command");
            say(errorMessage);
            return true;
        }

        const constructedJson = {
            triggerword: getTranslation(command[0].toLowerCase()),
            domain: getTranslation(command[1].toLowerCase()),
            commandname: getTranslation(command[2].toLowerCase()),
            value: getTranslation(command[3].toLowerCase()),
            unit: getTranslation(parseUnit(command[4].toLowerCase())),
            direction: getTranslation(command[5].toLowerCase()),
            raw: msg,
            origin: direction == 0 ? "driver" : "passenger",
            //originallanguage: language, //TODO: clearify
            status_indicator: 200
        }
    
        console.log("Constructed JSON: ", JSON.stringify(constructedJson, null, 2));

        try {
            fetch (config.Hyper_Endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(constructedJson)
            }).then(res => {
                console.log("Response: ", res);
            }).catch(err => {
                console.log("Error: ", err);
            });
        } catch (e) {
            console.log("Error: ", e);
        }

        return true;
    }

    return false;
}

const parseUnit = (unit: string): string => {
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
}


