import config from "../../config.json";
import {wake} from "../app";
import {getMicrophoneStream, startMicrophoneStream, stopMicrophoneStream} from "../hardware/microphone";


let enableSent = false;
let disableSent = true;
let timeout: any = null;

export const analyzeStream = (onFinish: Function) => {
    //wait 1 second before starting to analyze the stream
    startMicrophoneStream('volume-level-analyzer');
    getMicrophoneStream('volume-level-analyzer').on('data', (chunk: Buffer) => {
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
        //console.log('avg: ' + average);

        if (average > config.volumeThreshold) {
            if (timeout != null) {
                //console.log("[VolumeLevelAnalyzer] Timeout is not null");
                clearTimeout(timeout);
                timeout = null;
            }
        } else {
            console.log('under threshold');
            if (timeout == null) {
                console.log('timeout is null');
                timeout = setTimeout(() => {
                    console.log('in timeout callback');
                    stopMicrophoneStream('volume-level-analyzer');
                    console.log('stopped mic: ');
                    onFinish();
                }, 1000);
            }
        }
    });
}