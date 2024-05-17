import config from "../../config.json";
import { getErrorMsg } from "./error-messages";
import { say } from "../text-to-speech/textToSpeech";
import { getTranslation } from "./dictionary";

export const intercept = (msg: string, language: string, direction: number): boolean => {
  msg = msg.replace(/!|\?|\./g, '');

  if (msg.toLowerCase().startsWith("hyper")) {
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

    // Check if value and unit are combined and split them
    if (command.length === 5 && /\d+[a-zA-Z]+/.test(command[3])) {
      const [value, unit] = splitValueUnit(command[3]);
      command[3] = value;
      command.splice(4, 0, unit);
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
      value: parseValue(command[3]),
      unit: parseUnit(getTranslation(command[4].toLowerCase(), language, "unit")),
      direction: getTranslation(command[5].toLowerCase(), language, "direction"),
      raw: msg,
      origin: direction == 0 ? "driver" : "passenger",
      //originallanguage: language, //TODO: clearify
      status_indicator: 200
    }

    console.log("Constructed JSON: ", JSON.stringify(constructedJson, null, 2));

    // Debug: Check the value and parsed value
    console.log("Value:", command[3]);
    console.log("Parsed Value:", parseValue(command[3]));

    try {
      fetch(config.Hyper_Endpoint, {
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

const parseValue = (value: string): number => {
  const lowerCaseValue = value.toLowerCase();
  const numberMap: { [key: string]: number } = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50
  };

  // Debug: Check the lowercase value and mapped value
  console.log("Lower Case Value:", lowerCaseValue);
  console.log("Mapped Value:", numberMap[lowerCaseValue]);

  return numberMap[lowerCaseValue] || parseInt(value);
}

const parseUnit = (unit: string): string => {
  const unitMap: { [key: string]: string } = {
    "centimeter": "cm",
    "degree": "angle",
    "percent": "%",
    "meter": "m",
    "millimeter": "mm"
  };

  return unitMap[unit] || unit;
}

const splitValueUnit = (combined: string): [string, string] => {
  const match = combined.match(/(\d+)([a-zA-Z]+)/);
  if (match) {
    const value = match[1];
    const unit = match[2];
    return [value, unit];
  }
  return [combined, ""];
}