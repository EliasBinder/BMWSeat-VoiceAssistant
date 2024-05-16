import openAI from "../config/openAI";
// import functionsNOI from "./functionsNOI";

export const getVoiceFeedback = async (toExecute: string) => {
  const response = await openAI.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful voice assistant that can move a car seat." +
          "You can move the seat forward (horizontally), adjust the shoulders, adjust the size to the seat of the user for S, M and L, and adjust the backrest. " +
          "You can also select a predefined mode for the seat. The predefined modes are Parking, Comfort and Exit and Entry to make it easier to get in and out of the car. " +
          "You will receive a description of the action that is performed with the seat. " +
          "Formulate a response using that data. That response will be played using the speakers inside the car. ",
      },
      { role: "user", content: 
        toExecute
      },
    ],
  });

  let textResponse = response.choices[0].message.content;

  try {
    const parsedJson = JSON.parse(textResponse!);
    textResponse = parsedJson["response"];
  } catch (e) {}

  console.log("content: " + textResponse);

  return textResponse;
};

export const mapDataForVoiceOutput = (data: {name: string, arguments: any}) => {
  switch (data.name) {
    case 'move_seat_horizontal':
      if (data.arguments.direction == true)
        data.name = 'forward';
      else
        data.name = 'backwards';
      delete data.arguments.direction;
      break;

    case 'move_backrest':
      if (data.arguments.direction == true)
        data.name = 'Backrest forward';
      else
        data.name = 'Backrest backwards';
      delete data.arguments.direction;
      break;
    
    case 'move_shoulder':
      if (data.arguments.direction == true)
        data.name = 'Shoulder area forward';
      else
        data.name = 'Shoulder area backwards';
      delete data.arguments.direction;
      break;
  }

  return data;
}