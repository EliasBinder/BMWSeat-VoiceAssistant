import openAI from "../config/openAI";
// import functionsNOI from "./functionsNOI";
import functionsTratter from "./functionsTratter";
import { getVoiceFeedback } from "./gptVoiceResponse";

export async function interpretMessage(userInput: string) {
  const response = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful voice assistant that can move a car seat. " +
          "You can move the seat forward, adjust the shoulders, adjust the seat to the size of the user for S, M and L, and adjust the backrest." +
          "You can also select a predefined mode for the seat. The predefined modes are Parking, Comfort and Exit and Entry to make it easier to get in and out of the car." +
          "The user may not express his request directly, but instead may express the current circumstances which he is not happy with." +
          "Give a proper response to the user and then call the appropriate function. Never ask the user for clarification to meet all the requirements of a function since the user cannot respond.",
      },
      { role: "user", content: userInput },
    ],
    functions: functionsTratter,
    function_call: "auto",
  });

  const completion = response.choices[0].message;

  const textResponse = await getVoiceFeedback(
    JSON.stringify(completion.function_call, null, 2),
  );

  // return array of response text and function called
  return [textResponse, completion.function_call];
}
