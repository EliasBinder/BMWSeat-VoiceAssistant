const Mic = require('node-microphone');
const mic = new Mic();

let stream: any = null;

export const getMicrophoneStream = () => {
    if (stream == null || stream.ended || stream.finished || stream.destroyed)
        stream = mic.startRecording();
    return stream;
}

export const getStandaloneMicrophone = () => {
    return new Mic({
        channels: 2
    });
}

export const stopMicrophoneStream = () => {
    mic.stopRecording();
    stream = null;
}