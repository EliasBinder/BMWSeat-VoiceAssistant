import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../config/openAI";
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
    mic.on('error', function (error2: any) {
        console.log('mic error: ' + error2)
    })
    const stream = mic.startRecording();
    stream.pipe(outputStream);
    stream.on('end', () => {
        console.log('mic stream ended');
    })
    stream.on('error', function (error2: any) {
        console.log('stream error: ' + error2)
    })

    stopTranscription = async () => {
        console.log('stop the transcription');
        stream.unpipe(outputStream);
        mic.stopRecording();
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