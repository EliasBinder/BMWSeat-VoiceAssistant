import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volumeLevelAnalyzer/volumeLevelAnalyzer";
import seatController from "./seatAPI/seatController";
import {getMicrophoneStream, stopMicrophoneStream} from "./hardware/microphone";
import {startRestAPI} from "./restapi/httpServer";
import {sendStreamData} from "./restapi/api/apiRouter";
import {transcribeMicrophone} from "./speech-to-text/speech_to_text";

//Setup Rest API
startRestAPI();

//Start volume level analyzer to detect when user is speaking
console.log('🎤 Starting volume level analyzer...');

//seatController.makeDummyRequest();

//When wake word is detected or button is pressed: invoke this function
export const wake = async () => {
    analyzeStream(() => {
        console.log('🎤 System is listening...');
    }, () => {
        console.log('🎤 System is not listening...');
        stopMicrophoneStream();
    });
    console.log('🚀 System is awake!');
    const transcript = await transcribeMicrophone();
    console.log('Transcript: ', transcript);
    try {
        const gptResponse = await interpretMessage(transcript);
        gptResponse.forEach((value: any) => {
            console.log('GPT Response JSON: ', JSON.stringify(value));
            sendStreamData(value);
        });
        //TODO: process json -> move motor & play audio
    } catch (e) {
        playAudio('error.mp3');
        console.log('❌ GPT Response JSON: ', e)
    }
}
