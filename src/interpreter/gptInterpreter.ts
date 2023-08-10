import openAI from "../config/openAI";
import functionsNOI from "./functionsNOI";

export async function interpretMessage(userInput: string){
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {role: "system", content: "You are a helpful assistant that can move a car seat. " +
                    "You can move the seat forward, backward, up, down, and adjust the backrest. " +
                    "You can also select a predefined mode for the seat. The predefined modes are relax, sleep and drive. " +
                    "The user may not express his request directly, but instead may express the current circumstances which he is not happy with."},
            {role: "user", content: userInput},
        ],
        functions: functionsNOI,
        function_call: "auto"
    });

    const completion = response.data.choices[0].message

    return completion.function_call;
}