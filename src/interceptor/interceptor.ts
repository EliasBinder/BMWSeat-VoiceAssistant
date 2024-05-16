
import config from "../../config.json";
import { getErrorMsg } from "./error-messages";
import { say } from "../text-to-speech/textToSpeech";
import { getTranslation } from "./dictionary";

export const intercept = (msg: string, direction: number): boolean => {
    msg = msg.replace(/!|\?|\./g, ''); 

    if (msg.toLowerCase().startsWith("hyper")){
        (async () => {
            const { franc } = await import("franc");
            console.log("Intercepted: ", msg);
            let lang = franc(msg);
            console.log("Language: ", lang);
            if (lang !== "de" && lang !== "en" && lang !== "it")
                lang = "en";

            const command = msg.split(" ");
            console.log("Command: ", command);

            if (command.length != 6) {
                const errorMessage = getErrorMsg(lang as any);
                console.log("Error: Invalid command");
                say(errorMessage);
                return;
            }

            const constructedJson = {
                triggerword: getTranslation(command[0].toLowerCase(), lang as any),
                domain: getTranslation(command[1].toLowerCase(), lang as any),
                commandname: getTranslation(command[2].toLowerCase(), lang as any),
                value: getTranslation(command[3].toLowerCase(), lang as any),
                unit: getTranslation(parseUnit(command[4].toLowerCase()), lang as any),
                direction: getTranslation(command[5].toLowerCase(), lang as any),
                raw: msg,
                origin: direction == 0 ? "driver" : "passenger",
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
        })();

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


