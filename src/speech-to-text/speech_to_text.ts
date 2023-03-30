import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import fs from 'fs';

export async function transcribeFile(filepath: string){
    const api_config:Configuration = new Configuration({
        apiKey: config.OpenAI_API_Key,
    });

    const openai:OpenAIApi = new OpenAIApi(api_config);

    const resp = await openai.createTranscription(
        fs.createReadStream(filepath),
        "whisper-1"
    );
    console.log(resp.data.text);
    return resp.data.text;
}