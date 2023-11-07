import {addCallback, removeCallback} from "../interrupts/interrupts";
import {stopMicrophoneStream} from "../hardware/microphone";

let timeout: any = null;
const vlaId = 0;

export const analyzeStream = (onFinish: Function) => {
    console.log('🎤 Start analyzing stream');
    let startedSpeaking = false;

    addCallback(vlaId, (data: Buffer) => {
        const isVAD = data[2] === 1;

        console.log('🎤 Is Speaking: ', isVAD);
        console.log('🎤 Started speaking: ', startedSpeaking)

        if (isVAD) {
            startedSpeaking = true;
            if (timeout != null) {
                clearTimeout(timeout);
                timeout = null;
            }
        } else {
            if (timeout == null && startedSpeaking) {
                timeout = setTimeout(() => {
                    removeCallback(vlaId);
                    onFinish();
                }, 500);
            }
        }
    });
}