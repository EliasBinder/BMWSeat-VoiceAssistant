import openAI from "../config/openAI";
// import functionsNOI from "./functionsNOI";

export const getVoiceFeedback = async (toExecute: string) => {
  const response = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful voice assistant that can move a car seat." +
          "You will receive a description of the action that is performed with the seat." +
          "Formulate a response using that data. That response will be played using the speakers inside the car.",
      },
      { role: "user", content: toExecute },
    ],
  });

  const textResponse = response.choices[0].message.content;

  console.log("content: " + textResponse);

  return textResponse;
};
