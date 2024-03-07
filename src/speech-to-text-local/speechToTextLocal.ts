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
        stopMicrophoneStream('transcription');
        let resp = '';

        try {
            resp = await fetch('http://127.0.0.1:3001')
                .then(res => res.text())
        }catch (e){
            console.error('whisper error local: ' + e)
        }

        return resp;
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