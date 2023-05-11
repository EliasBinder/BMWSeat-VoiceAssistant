import config from "../../config.json";
import {wake} from "../app";
import {getMicrophoneStream} from "../hardware/microphone";


let enableSent = false;
let disableSent = true;
let timeout: any = null;

export const analyzeStream = (onEnable: Function, onDisable: Function) => {
    //wait 1 second before starting to analyze the stream
    setTimeout(() => {
        console.log('🎤 System is waiting for user input...');
    }, 1000);
    const stream = getMicrophoneStream();
    stream.on('data', (chunk: Buffer) => {
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
                }, 1000);
            }
        }
    });

    /*stream.on('end', () => {
        analyzeStream(onEnable, onDisable);
    });*/
}