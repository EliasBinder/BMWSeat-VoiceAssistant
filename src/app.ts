import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volumeLevelAnalyzer/volumeLevelAnalyzer";
import seatController from "./seatAPI/seatController";
import {getMicrophoneStream, stopMicrophoneStream} from "./hardware/microphone";
import {startRestAPI} from "./restapi/httpServer";
import {sendStreamData} from "./restapi/api/apiRouter";
import {stopTranscriptionMicrophone, transcribeMicrophone} from "./speech-to-text/speech_to_text";

//Setup Rest API
startRestAPI();

//Start volume level analyzer to detect when user is speaking
console.log('🎤 Starting volume level analyzer...');

//seatController.makeDummyRequest();
analyzeStream(() => {
    console.log('🎤 System is listening...');
}, async () => {
    console.log('🎤 System is not listening...');
    const text = await stopTranscriptionMicrophone();
    interpretCommand(text);
});


//When wake word is detected or button is pressed: invoke this function
export const wake = async () => {
    console.log('🚀 System is awake!');
    transcribeMicrophone();
}

const interpretCommand = async (command: string) => {
    try {
        const gptResponse = await interpretMessage(command);
        gptResponse.forEach((value: string) => {
            console.log('GPT Response JSON: ', JSON.stringify(gptResponse));
        });
        //TODO: process json -> move motor & play audio
        sendStreamData(gptResponse);
    } catch (e) {
        playAudio('error.mp3');
        console.log('❌ GPT Response JSON: ', e)
    }
}
