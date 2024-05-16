import openAI from "../config/openAI";
import fs from "fs";
import {
  recordMicrophoneStream,
  stopMicrophoneStream,
} from "../hardware/microphone";

let stopTranscription = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    resolve("");
  });
};

export function transcribeMicrophone() {
  //Create a file from the stream
  recordMicrophoneStream("transcription");

  stopTranscription = async () => {
    stopMicrophoneStream("transcription");
    let resp: { text: string } = { text: "" };

    try {
      resp = await openAI.audio.transcriptions.create({
        file: fs.createReadStream("resources/transcription.wav"),
        model: "whisper-1",
        prompt: "Transcribe the following audio. In special cases, the user may use a special structure, like 'hyper sitz bewegen 1 zentimeter vorwärts'" 
       
      });
      
      resp.text = resp.text.replace(/!/g, '');
    } catch (e) {
      console.error("whisper error: " + e);
    }
    return resp.text;
  };
}

export async function stopTranscriptionMicrophone() {
  const result = await stopTranscription();
  stopTranscription = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      resolve("");
    });
  };
  return result;
}
