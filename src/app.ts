import openAI from "./singelton/OpenAI";
import server from "./ioCom/serverSocket";
import {getMicrophoneStream} from "./hardware/microphone";
import {transcribeStream} from "./speech-to-text/speech_to_text";
import {interpretMessage} from "./interpreter/gptInterpreter";
import {playAudio} from "./hardware/speaker";

const micStream = getMicrophoneStream();

export const wake = async () => {
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

