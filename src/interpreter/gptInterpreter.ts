import openAI from "../config/openAI";
import fs from "fs";
import {getPromptAfter, getPromptBefore} from "./promptLoader";
import {extractJson} from "./jsonExtractor";

export async function interpretMessage(userInput: string){
    const prompt = getPromptBefore() + userInput + getPromptAfter();
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
            {role: "user", content: prompt},
        ],
    });
    const fullGPTResponse = response.data.choices[0].message.content;

    const gptResponse = extractJson(fullGPTResponse);
    let gptResponseJSON: any[] = [];

    gptResponse.forEach((value: any) => {
        gptResponseJSON.push(JSON.parse(value));
    });

    return gptResponseJSON;
}