import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volumeLevelAnalyzer/volumeLevelAnalyzer";
import {getMicrophoneStream, stopMicrophoneStream} from "./hardware/microphone";
import {startRestAPI} from "./restapi/httpServer";
import {sendStreamData} from "./restapi/api/apiRouter";

//Setup Rest API
startRestAPI();

//Start volume level analyzer to detect when user is speaking
console.log('🎤 Starting volume level analyzer...');
analyzeStream(() => {
    console.log('🎤 System is listening...');
}, () => {
    console.log('🎤 System is not listening...');
    stopMicrophoneStream();
});


//When wake word is detected or button is pressed: invoke this function
export const wake = async () => {
    console.log('🚀 System is awake!');
    const transcript = await transcribeMicrophone();
    console.log('Transcript: ', transcript);
    try {
        const gptResponse = await interpretMessage(transcript);
        console.log('GPT Response JSON: ', JSON.stringify(gptResponse));
        //TODO: process json -> move motor & play audio
        sendStreamData(gptResponse);
    } catch (e) {
        playAudio('error.mp3');
        console.log('❌ GPT Response JSON: ', e)
    }
}

//TODO: enable analyze again
