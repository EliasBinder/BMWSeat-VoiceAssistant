import config from "../../config.json";
import {wake} from "../app";
import {getMicrophoneStream, getStandaloneMicrophone} from "../hardware/microphone";


let enableSent = false;
let disableSent = true;
let timeout: any = null;

export const analyzeStream = (onFinish: Function) => {
    //wait 1 second before starting to analyze the stream
    const mic = getStandaloneMicrophone();
    const stream = mic.startRecording();
    stream.on('data', (chunk: Buffer) => {
        console.log('Receiving data from microphone')
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
        console.log('avg: ' + average);

        if (average > config.volumeThreshold) {
            if (timeout != null) {
                //console.log("[VolumeLevelAnalyzer] Timeout is not null");
                clearTimeout(timeout);
                timeout = null;
            }
        } else {
            if (timeout == null) {
                timeout = setTimeout(() => {
                    mic.stopRecording();
                    onFinish();
                }, 1000);
            }
        }
    });
}