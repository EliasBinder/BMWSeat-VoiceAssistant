import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../singelton/OpenAI";
import fs, {ReadStream} from 'fs';
import {getMicrophoneStream, getStandaloneMicrophone, stopMicrophoneStream} from "../hardware/microphone";
import {Readable} from "stream";

let disableTranscribe = () => {};

export async function transcribeFile(filepath: string){
    return transcribeStream(fs.createReadStream(filepath))
}

export async function transcribeStream(stream: Readable){
    //Create a file from the stream
    const outputStream = fs.createWriteStream('resources/transcription.wav');
    stream.pipe(outputStream);
    disableTranscribe = () => {
        stopMicrophoneStream();
    }
    //Transcribe the file
    const resp = await openAI.openai.createTranscription(
        fs.createReadStream('resources/transcription.wav'),
        "whisper-1"
    );
    return resp.data.text;
}

export async function transcribeMicrophone(){
    stopMicrophoneStream();
    return transcribeStream(getMicrophoneStream());
}

export function getDisablingFunc(){
    return disableTranscribe;
}