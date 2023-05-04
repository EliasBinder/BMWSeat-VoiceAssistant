import {transcribeMicrophone, transcribeStream} from "./speech-to-text/speech_to_text";
import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volumeLevelAnalyzer/volumeLevelAnalyzer";
import notifyWakewordAI from "./ioCom/tcpServer/abstraction/notifyWakewordAI";
import serverSocket from "./ioCom/tcpServer/serverSocket";
import {getMicrophoneStream, stopMicrophoneStream} from "./hardware/microphone";

//Setup TCP server
console.log('📡 Starting TCP server...');
serverSocket.createServer();

//Start volume level analyzer to detect when user is speaking
console.log('🎤 Starting volume level analyzer...');
analyzeStream(() => {
    console.log('🎤 System is listening...');
    notifyWakewordAI(true);
}, () => {
    console.log('🎤 System is not listening...');
    notifyWakewordAI(false);
    stopMicrophoneStream();
});


//When wake word is detected or button is pressed: invoke this function
export const wake = async () => {
    console.log('🚀 System is awake!');
    notifyWakewordAI(false);
    const transcript = await transcribeMicrophone();
    console.log('Transcript: ', transcript);
    try {
        const gptResponse = await interpretMessage(transcript);
        console.log('GPT Response JSON: ', JSON.stringify(gptResponse));
        //TODO: process json -> move motor & play audio
    } catch (e) {
        playAudio('error.mp3');
        console.log('❌ GPT Response JSON: ', e)
    }
}

//TODO: enable analyze again
