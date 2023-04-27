import openAI from "../singelton/OpenAI";
import fs from "fs";
import {getPromptAfter, getPromptBefore} from "./promptLoader";
import {extractJson} from "./jsonExtractor";

export async function interpretMessage(userInput: string){
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "user", content: getPromptBefore()},
            {role: "user", content: userInput},
            {role: "user", content: getPromptAfter()}
        ],
    });
    const fullGPTResponse = response.data.choices[0].message.content;
    console.log('message: ' + fullGPTResponse);
    return JSON.parse(extractJson(fullGPTResponse) || '{}');
}