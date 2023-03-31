import openAI from "../singelton/OpenAI";
import fs from "fs";
import OpenAI from "../singelton/OpenAI";
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
        max_tokens: 4000,
        temperature: 0,
    });
    const fullGPTResponse = response.data.choices[0].message.content;
    return JSON.parse(extractJson(fullGPTResponse) || '{}');
}