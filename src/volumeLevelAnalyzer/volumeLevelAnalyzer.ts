import config from "../../config.json";
import {wake} from "../app";
import notifyWakewordAI from "../ioCom/tcpServer/abstraction/notifyWakewordAI";
import {getMicrophoneStream} from "../hardware/microphone";


let enableSent = false;
let disableSent = true;
let timeout: any = null;

export const analyzeStream = (onEnable: Function, onDisable: Function) => {
    getMicrophoneStream().on('data', (chunk: Buffer) => {
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

        //console.log("[VolumeLevelAnalyzer] Average is ", average);

        if (average > config.volumeThreshold) {
            if (timeout != null) {
                //console.log("[VolumeLevelAnalyzer] Timeout is not null");
                clearTimeout(timeout);
                timeout = null;
            } else {
                if (!enableSent) {
                    onEnable();
                    enableSent = true;
                    disableSent = false;
                }
            }
        }else {
            if (timeout == null) {
                timeout = setTimeout(() => {
                    if (!disableSent) {
                        onDisable();
                        enableSent = false;
                        disableSent = true;
                    }
                }, 3000);
            }
        }
    });
}