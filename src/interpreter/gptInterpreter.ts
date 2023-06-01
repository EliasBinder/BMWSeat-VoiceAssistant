import openAI from "../config/openAI";
import fs from "fs";
import {getPromptAfter, getPromptBefore} from "./promptLoader";
import {extractJson} from "./jsonExtractor";

export async function interpretMessage(userInput: string){
    const prompt = getPromptBefore() + userInput + getPromptAfter();
    /*const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
            {role: "user", content: prompt},
        ],
    });*/
    const response = await openAI.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log("response from openai: " + response.data.choices[0].text);
    //const fullGPTResponse = response.data.choices[0].message.content;
    const fullGPTResponse = response.data.choices[0].text;

    const gptResponse = extractJson(fullGPTResponse);
    let gptResponseJSON: any[] = [];

    gptResponse.forEach((value: any) => {
        gptResponseJSON.push(JSON.parse(value));
    });

    return gptResponseJSON;
}