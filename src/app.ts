import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volume-level-analyzer/volumeLevelAnalyzer";
import seatController from "./seat-API/seatController";
import {getMicrophoneStream, stopMicrophoneStream} from "./hardware/microphone";
import {startRestAPI} from "./rest-API/httpServer";
import {sendStreamData} from "./rest-API/api/apiRouter";
import {stopTranscriptionMicrophone, transcribeMicrophone} from "./speech-to-text/speechToText";
import {fetchMicrophoneInterrupts, stopFetchMicrophoneInterrupts} from "./direction-of-voice/directionOfVoice";

//Setup Rest API
startRestAPI();


//seatController.makeDummyRequest();


export const wake = async () => {
    analyzeStream(async () => {
        console.log('🎤 System is not listening...');
        const text = await stopTranscriptionMicrophone();
        //const direction = await stopFetchMicrophoneInterrupts();
        if (text.trim() !== '')
            interpretCommand(text, 1);
    });

    transcribeMicrophone();
    console.log('🚀 System is awake!');
    //fetchMicrophoneInterrupts();
}

const interpretCommand = async (command: string, direction: number) => {
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