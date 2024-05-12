import { interpretMessage } from "./interpreter/gptInterpreter";
import { analyzeStream } from "./volume-level-analyzer/volumeLevelAnalyzer";
import { startRestAPI } from "./rest-API/httpServer";
import {
  stopTranscriptionMicrophone,
  transcribeMicrophone,
} from "./speech-to-text/speechToText"; //Use local whisper
import { processResponse } from "./seat-API/seatCommandMapper";
import { startAnalyzing } from "./interrupts/interrupts";
import { fetchDOV, stopFetchDOV } from "./direction-of-voice/directionOfVoice";
import { intercept } from "./interceptor/interceptor";

//Setup Rest API
startRestAPI();

//Setup microphone interrupts
startAnalyzing();

export const wake = () => {
  analyzeStream(async () => {
    console.log("🎤 System is not listening...");
    const text = await stopTranscriptionMicrophone();
    const direction = await stopFetchDOV();
    console.log("🎤 Transcription: ", text);
    if (text.trim() !== "") {
      if (!intercept(text, direction))
        interpretCommand(text, direction);
    }
  });

  transcribeMicrophone();
  console.log("🚀 System is awake!");
  fetchDOV();
};

const interpretCommand = async (command: string, direction: number) => {
  try {
    const gptResponse = await interpretMessage(command);
    console.log("✅ GPT Response: ", JSON.stringify(gptResponse));
    processResponse(gptResponse, direction >= 0 ? "DS" : "PS");
  } catch (e) {
    //playAudio("error.mp3");
    console.log("❌ GPT Response JSON: ", e);
  }
};
