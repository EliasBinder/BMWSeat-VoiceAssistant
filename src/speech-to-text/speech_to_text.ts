import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../singelton/OpenAI";
import fs from 'fs';

export async function transcribeFile(filepath: string){

    const resp = await openAI.openai.createTranscription(
        //@ts-ignore
        fs.createReadStream(filepath),
        "whisper-1"
    );
    console.log(resp.data.text);
    return resp.data.text;
}