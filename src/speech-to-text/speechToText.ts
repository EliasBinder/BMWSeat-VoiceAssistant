import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../config/openAI";
import fs, {ReadStream} from 'fs';
import {Readable} from "stream";
import {recordMicrophoneStream, stopMicrophoneStream} from "../hardware/microphone";

let stopTranscription = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        resolve('')
    })
}

export function transcribeMicrophone(){
    //Create a file from the stream
    recordMicrophoneStream('transcription');

    stopTranscription = async () => {
        console.log('stop the transcription');
        stopMicrophoneStream('transcription');
        let resp = {data: {text: ''}};

        try {
            resp = await openAI.openai.createTranscription(
                fs.createReadStream('resources/transcription.wav'),
                "whisper-1"
            );
        }catch (e){
            console.error('whisper error: ' + e)
        }

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