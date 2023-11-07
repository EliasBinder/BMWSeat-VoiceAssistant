import openAI from "../config/openAI";
import functionsNOI from "./functionsNOI";
import functionsTratter from "./functionsTratter";

export async function interpretMessage(userInput: string){
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {role: "system", content: "You are a helpful assistant that can move a car seat. " +
                    "You can move the seat forward, adjust the shoulders, adjust the seat to the size of the user for S, M and L, and adjust the backrest." +
                    "You can also select a predefined mode for the seat. The predefined modes are Parking, Comfort and Exit and Entry to make it easier to get in and out of the car." +
                    "The user may not express his request directly, but instead may express the current circumstances which he is not happy with."},
            {role: "user", content: userInput},
        ],
        functions: functionsNOI,
        function_call: "auto"
    });

    const completion = response.data.choices[0].message

    return completion.function_call;
}