import openAI from "../config/openAI";
import functionsNOI from "./functionsNOI";

export const getVoiceFeedback = async (toExecute: string) => {
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {
                role: "system", content: "You are a helpful voice assistant that can move a car seat." +
                    "For every message from the user, formulate a response using the data from the function call. That response will be played using the speakers inside the car."
            },
            {role: "user", content: toExecute},
        ]
    });

    const textResponse = response.data.choices[0].message.content

    console.log('content: ' + textResponse);

    return textResponse;
}