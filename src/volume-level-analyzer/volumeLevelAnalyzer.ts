import config from "../../config.json";
import {getMicrophoneStream, startMicrophoneStream, stopMicrophoneStream} from "../hardware/microphone";


let timeout: any = null;

export const analyzeStream = (onFinish: Function) => {
    let startedSpeaking = false;
    let isFirstProcessed = false;

    //wait 1 second before starting to analyze the stream
    startMicrophoneStream('volume-level-analyzer');
    // @ts-ignore
    getMicrophoneStream('volume-level-analyzer').stdout.on('data', (chunk: Buffer) => {
        //console.log('Receiving data from microphone')
        //Construct array of 16-bit integers representing the audio data
        let out: any = [];
        for (let i = 0; i < chunk.length; i += 2) {
            out.push(Math.abs(chunk.readInt16LE(i)));
        }

        //Calculate the average volume
        let average = 0;
        out.forEach((value: number) => {
            average += value;
        });
        average /= out.length;

        console.log('🎤 Volume: ', average)
        console.log('🎤 Started speaking: ', startedSpeaking)

        if (!isFirstProcessed) {
            //Wav headers will be included for first level calculation --> ignore
            isFirstProcessed = true;
            return;
        }

        if (average > config.volumeThreshold) {
            startedSpeaking = true;
            if (timeout != null) {
                clearTimeout(timeout);
                timeout = null;
            }
        } else {
            if (timeout == null && startedSpeaking) {
                timeout = setTimeout(() => {
                    stopMicrophoneStream('volume-level-analyzer');
                    onFinish();
                }, 1000);
            }
        }
    });
}