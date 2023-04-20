import openAI from "./singelton/OpenAI";
import server from "./ioCom/tcpServer/serverSocket";
import {getMicrophoneStream, stopMicrophoneStream} from "./hardware/microphone";
import {transcribeMicrophone, transcribeStream} from "./speech-to-text/speech_to_text";
import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volumeLevelAnalyzer/volumeLevelAnalyzer";
import notifyWakewordAI from "./ioCom/tcpServer/abstraction/notifyWakewordAI";

//Get microphone stream

//Start volume level analyzer to detect when user is speaking
analyzeStream(() => {
    console.log('[VolumeLevelAnalyzer] System is listening...');
    notifyWakewordAI(true);
}, () => {
    console.log('[VolumeLevelAnalyzer] System is not listening...');
    notifyWakewordAI(false);
});


//When wake word is detected or button is pressed: invoke this function
export const wake = async () => {
    console.log('System is awake. Please speak now...')
    const transcript = await transcribeMicrophone();
    console.log('Transcript: ', transcript);
    try {
        const gptResponse = await interpretMessage(transcript);
        console.log('GPT Response JSON: ', JSON.stringify(gptResponse));
        //TODO: process json -> move motor & play audio
    } catch (e) {
        playAudio('error.mp3');
    }
}

//Listen for CLI commands
// const prompt = require('prompt-sync')();
// while (true) {
//     const action = prompt('Action: ');
//     switch (action) {
//         case 's':
//             stopMicrophoneStream();
//             break;
//         case 'w':
//             wake();
//             break;
//     }
// }

//TODO: enable analyze again
