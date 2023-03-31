import openAI from "./singelton/OpenAI";
import server from "./ioCom/tcpServer/serverSocket";
import {getMicrophoneStream} from "./hardware/microphone";
import {transcribeStream} from "./speech-to-text/speech_to_text";
import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";
import {analyzeStream, setAnalyze} from "./volumeLevelAnalyzer/volumeLevelAnalyzer";

//Get microphone stream
const micStream = getMicrophoneStream();

//Start volume level analyzer to detect when user is speaking
analyzeStream(micStream);


//When wake word is detected or button is pressed: invoke this function
export const wake = async () => {
    setAnalyze(false) //Stop analyzing volume level
    const transcript = await transcribeStream(micStream);
    console.log('Transcript: ', transcript);
    try {
        const gptResponse = await interpretMessage(transcript);
        console.log('GPT Response JSON: ', JSON.stringify(gptResponse));
        //TODO: process json -> move motor & play audio
    } catch (e) {
        playAudio('error.mp3');
    }
}

//TODO: enable analyze again
