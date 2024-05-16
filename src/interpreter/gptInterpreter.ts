import openAI from "../config/openAI";
// import functionsNOI from "./functionsNOI";
import functionsTratter from "./functionsTratter";
import { getVoiceFeedback, mapDataForVoiceOutput } from "./gptVoiceResponse";

export async function interpretMessage(userInput: string) {
  const response = await openAI.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful voice assistant that can move a car seat. " +
          "You can move the seat forward, adjust the shoulders, adjust the size to the seat of the user for S, M and L, and adjust the backrest." +
          "You can also select a predefined mode for the seat. The predefined modes are Parking, Comfort and Exit and Entry to make it easier to get in and out of the car." +
          "The user may not express his request directly, but instead may express the current circumstances which he is not happy with." +
          "Never ask the user for clarification.",
      },
      { role: "user", content: userInput },
    ],
    functions: functionsTratter,
    function_call: "auto",
  });

  const completion = response.choices[0].message;

  //Reformat data for better GPT audio response

  if (!completion.function_call) {
    return [undefined, undefined];
  }

  const voiceOutputInstructions = {
    ...completion.function_call
  }
  voiceOutputInstructions.arguments = JSON.parse(voiceOutputInstructions.arguments!)

  const textResponse = await getVoiceFeedback(
    JSON.stringify(mapDataForVoiceOutput(voiceOutputInstructions as any), null, 2),
  );

  console.log("completion.function_call: " + completion.function_call);

  // return array of response text and function called
  return [textResponse, completion.function_call];
}
