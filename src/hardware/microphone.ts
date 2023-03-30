const Mic = require('node-microphone');
const mic = new Mic();

export const getStream = () => {
    return mic.startRecording();
}

export const stopStream = () => {
    mic.stopRecording();
}