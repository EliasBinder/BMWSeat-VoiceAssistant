import { Configuration, OpenAIApi } from "openai";
import config from "../../config.json";
import openAI from "../singelton/OpenAI";
import fs, {ReadStream} from 'fs';
import {getMicrophoneStream, getStandaloneMicrophone, stopMicrophoneStream} from "../hardware/microphone";
import {Readable} from "stream";

export async function transcribeFile(filepath: string){
    return transcribeStream(fs.createReadStream(filepath))
}

export async function transcribeStream(stream: Readable){
    //Create a file from the stream
    const outputStream = fs.createWriteStream('resources/transcription.wav');
    const mic = getStandaloneMicrophone();
    const stream2 = mic.startRecording();
    stream2.pipe(outputStream);
    //Await until the stream is finished
    await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
    stream2.unpipe(outputStream);
    mic.stopRecording();
    //Transcribe the file
    const resp = await openAI.openai.createTranscription(
        fs.createReadStream('resources/transcription.wav'),
        "whisper-1"
    );
    return resp.data.text;
}

export async function transcribeMicrophone(){
    return transcribeStream(getMicrophoneStream());
}