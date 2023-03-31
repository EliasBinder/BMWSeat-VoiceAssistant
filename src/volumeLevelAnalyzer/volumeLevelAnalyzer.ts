import config from "../../config.json";
import {wake} from "../app";

export const analyzeStream = (stream: any) => {
    stream.on('data', (chunk: Buffer) => {
        let average = 0;
        let out: any = [];
        for (let i = 0; i < chunk.length; i += 2) {
            out.push(chunk.readInt16LE(i));
        }
        out.forEach((value: number) => {
            average += value;
        });
        average /= out.length;
        console.log('Avg: ', average);
    });
}