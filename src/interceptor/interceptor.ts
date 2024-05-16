
import config from "../../config.json";
import { getErrorMsg } from "./error-messages";
import { say } from "../text-to-speech/textToSpeech";
import { getTranslation } from "./dictionary";

export const intercept = (msg: string, language: string, direction: number): boolean => {
    msg = msg.replace(/!|\?|\./g, ''); 

    if (msg.toLowerCase().startsWith("hyper")){
        console.log("Intercepted: ", msg);

        if (language != "en" && language != "de" && language != "it")
            language = "en";

        //Ugly fix for german language
        //if (msg.toLowerCase().startsWith("hypersitz")) {
        //    msg = msg.toLocaleLowerCase().replace("hypersitz", "hyper sitz");
        //}

        const command = msg.split(" ");

        // Better fix for german language
        if (!(command[0].toLocaleLowerCase() == "hyper")) {
            const postfix = command[0].toLocaleLowerCase().replace("hyper", "");
            command[0] = "hyper";
            command.splice(1, 0, postfix);
        }

        console.log("Command: ", command);

        if (command.length != 6) {
            const errorMessage = getErrorMsg(language as any);
            console.log("Error: Invalid command");
            say(errorMessage);
            return true;
        }

        const constructedJson = {
            triggerword: getTranslation(command[0].toLowerCase(), language, "triggerword"),
            domain: getTranslation(command[1].toLowerCase(), language, "domain"),
            commandname: getTranslation(command[2].toLowerCase(), language, "commandname"),
            value: command[3],
            unit: parseUnit(getTranslation(command[4].toLowerCase(), language, "unit")),
            direction: getTranslation(command[5].toLowerCase(), language, "direction"),
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
        case "centimeter":
            return "cm";
        case "degree":
            return "angle";
        case "percent":
            return "%";
        case "meter":
            return "m";
        case "millimeter":
            return "mm";
        default:
            return unit;
    }
}


