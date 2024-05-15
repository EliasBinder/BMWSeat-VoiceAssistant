import config from "./../config.json"

const constructedJson = {
    triggerword: "hyper",
    domain: "sitz",
    commandname: "bewegen",
    value: 8,
    unit: "cm",
    direction: "vorwärts",
    raw: "hyper sitz bewegen 8 zentimeter vorwärts",
    origin: "hyper",
    status_indicator: 200
}

try {
    fetch (config.Hyper_Endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(constructedJson)
    }).then(res => {
        return res.text()
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log("Error: ", err);
    });
} catch (e) {
    console.log("Error: ", e);
}