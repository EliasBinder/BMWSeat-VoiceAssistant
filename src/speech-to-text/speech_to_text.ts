import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../singelton/OpenAI";
import fs, {ReadStream} from 'fs';
import {getMicrophoneStream} from "../hardware/microphone";

export async function transcribeFile(filepath: string){
    return transcribeStream(fs.createReadStream(filepath))
}

export async function transcribeStream(stream: ReadStream){
    console.log('start transcription');
    const resp = await openAI.openai.createTranscription(
        //@ts-ignore
        stream,
        "whisper-1"
    );
    console.log(resp.data.text);
    return resp.data.text;
}

export async function transcribeMicrophone(){
    return transcribeStream(getMicrophoneStream());
}