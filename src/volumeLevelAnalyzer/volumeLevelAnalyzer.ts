import config from "../../config.json";
import {wake} from "../app";
import {sendPacketToWakewordAI} from "../ioCom/udpClient/udpClient";

export let analyze = true;
let timeout: any = null;

export const setAnalyze = (value: boolean) => {
    analyze = value;
}

export const analyzeStream = (stream: any) => {
    stream.on('data', (chunk: Buffer) => {
        if (!analyze) return;

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
        console.log('Avg: ', average);

        //TODO: use setTimeout to avoid stopping in user's thinking time
        if (average > config.volumeThreshold) {

            //TODO: MAYBE compress audio data to send to wakeword AI. Do tests to see if it's worth it
            sendPacketToWakewordAI(chunk);
        }
    });
}