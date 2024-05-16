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
import { say } from "./text-to-speech/textToSpeech";

//Setup Rest API
startRestAPI();

//Setup microphone interrupts
startAnalyzing();

export const wake = () => {
  analyzeStream(async () => {
    console.log("🎤 System is not listening...");
    const [text, language] = await stopTranscriptionMicrophone();
    const direction = await stopFetchDOV();//direion of voic4e
    console.log("🎤 Transcription: ", text);
    if (text.trim() !== "") {
      if (!intercept(text, language, direction))
        interpretCommand(text, language, direction);
    }
  });

  transcribeMicrophone();
  console.log("🚀 System is awake!");
  fetchDOV();
};

const interpretCommand = async (command: string, language: string, direction: number) => {
  try {
    const gptResponse = await interpretMessage(command);
    console.log("✅ GPT Response: ", JSON.stringify(gptResponse));
    if (!gptResponse[1]) {
      if (language === "de") {
        say("Ich habe den Befehl nicht verstanden.");
      } else if (language === "it") {
        say("Non ho capito il comando.");
      } else {
        say("I did not understand the command.");
      }
    }
    processResponse(gptResponse, direction >= 0 ? "DS" : "PS");
  } catch (e) {
    say("I failed to process the command. Please try again.");
    console.log("❌ GPT Response JSON: ", e);
  }
};
