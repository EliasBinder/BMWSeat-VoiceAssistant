import openAI from "../config/openAI";
import fs from "fs";
import {
  recordMicrophoneStream,
  stopMicrophoneStream,
} from "../hardware/microphone";

let stopTranscription = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    resolve(["", "en"]);
  });
};

export function transcribeMicrophone() {
  //Create a file from the stream
  recordMicrophoneStream("transcription");

  stopTranscription = async () => {
    stopMicrophoneStream("transcription");
    let resp: { text: string, language: string } = { text: "", language: "en" };

    try {
      resp = await openAI.audio.transcriptions.create({
        file: fs.createReadStream("resources/transcription.wav"),
        model: "whisper-1",
        prompt: "The audio contains instructions on how to move a car seat. Transcribe the audio word by word. The language can be german, english or italian. The audio may start with 'hyper'. Transcribe words as digits.",
        response_format: "verbose_json",
      }) as any;
    } catch (e) {
      console.error("whisper error: " + e);
    }
    return [resp.text, resp.language];
  };
}

export async function stopTranscriptionMicrophone() {
  const result = await stopTranscription();
  stopTranscription = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      resolve(["", "en"]);
    });
  };
  return result;
}
