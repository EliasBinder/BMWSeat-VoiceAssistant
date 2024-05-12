import config from "../../config.json";

export const intercept = (msg: String, direction: number): boolean => {
    if (msg.toLowerCase().startsWith("hyper")){
        console.log("Intercepted: ", msg);
        const command = msg.split(" ");
        const constructedJson = {
            triggerword: command[0].toLowerCase(),
            domain: command[1].toLowerCase(),
            commandname: command[2].toLowerCase(),
            unit: parseUnit(command[3].toLowerCase()),
            direction: command[4].toLowerCase(),
            raw: msg,
            // origin: direction,
            status_indicator: 200
        }

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


        return true;
    }
    return false;
}

const parseUnit = (unit: string): string => {
    switch (unit) {
        case "zentimeter":
            return "cm";
        case "grad":
            return "°";
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