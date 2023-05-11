import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../singelton/OpenAI";
import fs, {ReadStream} from 'fs';
import {getMicrophoneStream, getStandaloneMicrophone, stopMicrophoneStream} from "../hardware/microphone";
import {Readable} from "stream";

let stopTranscription = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        resolve('')
    })
}

export function transcribeMicrophone(){
    //Create a file from the stream
    const outputStream = fs.createWriteStream('resources/transcription.wav');
    const mic = getStandaloneMicrophone();
    const stream = mic.startRecording();
    stream.pipe(outputStream);

    stopTranscription = async () => {
        stream.unpipe(outputStream);
        mic.stopRecording();

        const resp = await openAI.openai.createTranscription(
            fs.createReadStream('resources/transcription.wav'),
            "whisper-1"
        );
        return resp.data.text;
    };

}

export async function stopTranscriptionMicrophone(){
    const result = await stopTranscription();
    stopTranscription = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            resolve('')
        })
    }
    return result;
}