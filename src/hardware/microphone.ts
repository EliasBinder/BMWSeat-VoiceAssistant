const Mic = require('node-microphone');
const mic = new Mic();

export const getMicrophoneStream = () => {
    return mic.startRecording();
}

export const stopMicrophoneStream = () => {
    mic.stopRecording();
}