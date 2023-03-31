import config from "../../config.json";
import {wake} from "../app";

export const analyzeStream = (stream: any) => {
    stream.on('data', (chunk: Buffer) => {
        //Construct array of 16-bit integers representing the audio data
        let out: any = [];
        for (let i = 0; i < chunk.length; i += 2) {
            out.push(chunk.readInt16LE(i));
        }

        //Calculate the average volume
        let average = 0;
        out.forEach((value: number) => {
            average += value;
        });
        average /= out.length;
        console.log('Avg: ', average);

        //TODO: compare average to threshold
    });
}