import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream} from "./volume-level-analyzer/volumeLevelAnalyzer";
import {startRestAPI} from "./rest-API/httpServer";
import {sendStreamData} from "./rest-API/api/apiRouter";
import {stopTranscriptionMicrophone, transcribeMicrophone} from "./speech-to-text/speechToText"; //Use local whisper
import {processResponse} from "./seat-API/seatCommandMapper";

//Setup Rest API
startRestAPI();

//seatController.makeDummyRequest();

export const wake = () => {
    analyzeStream(async () => {
        console.log('🎤 System is not listening...');
        const text = await stopTranscriptionMicrophone();
        //const direction = await stopFetchMicrophoneInterrupts();
        console.log('🎤 Transcription: ', text);
        if (text.trim() !== '')
            interpretCommand(text, 1);
    });

    transcribeMicrophone();
    console.log('🚀 System is awake!');
    //fetchMicrophoneInterrupts();
}

const interpretCommand = async (command: string, direction: number) => {
    try {
        const gptResponse = await interpretMessage(command);
        console.log('✅ GPT Response: ', JSON.stringify(gptResponse));
        processResponse(gptResponse, direction >= 0 ? 'DS' : 'PS');
    } catch (e) {
        playAudio('error.mp3');
        console.log('❌ GPT Response JSON: ', e);
    }
}