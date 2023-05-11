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


//seatController.makeDummyRequest();


export const wake = async () => {
    await analyzeStream(() => {
        console.log('🎤 System is listening...');
    }, async () => {
        console.log('🎤 System is not listening...');
        stopMicrophoneStream();
        const text = await stopTranscriptionMicrophone();
        if (text.trim() !== '')
            interpretCommand(text);
    });

    console.log('🚀 System is awake!');
    transcribeMicrophone();
}

const interpretCommand = async (command: string) => {
    console.log('🎤 Command: ', command);
    try {
        const gptResponse = await interpretMessage(command);
        gptResponse.forEach((value: string) => {
            console.log('GPT Response JSON: ', JSON.stringify(gptResponse));
        });
        //TODO: process json -> move motor & play audio
        sendStreamData({"actions": gptResponse});
    } catch (e) {
        playAudio('error.mp3');
        console.log('❌ GPT Response JSON: ', e)
    }
}