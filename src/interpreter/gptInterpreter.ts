import openAI from "../singelton/OpenAI";
import fs from "fs";
import {getPromptAfter, getPromptBefore} from "./promptLoader";
import {extractJson} from "./jsonExtractor";

export async function interpretMessage(userInput: string){
    const prompt = getPromptBefore() + userInput + getPromptAfter();
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "user", content: prompt},
        ],
    });
    const fullGPTResponse = response.data.choices[0].message.content;
    return JSON.parse(extractJson(fullGPTResponse) || '{}');
}