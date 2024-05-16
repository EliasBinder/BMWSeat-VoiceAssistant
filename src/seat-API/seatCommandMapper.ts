import {
  enableMode,
  moveBackrest,
  moveVertical,
  moveShoulder,
  setSize,
  moveHorizontal,
  moveIncline,
} from "./seatController";
import { say } from "../text-to-speech/textToSpeech";

export const processResponse = (gptResponse: any, seat: "DS" | "PS") => {
  console.log("gptResponse: ", gptResponse);
  const getMessages = gptResponse[0];
  const gptFunctionCall = gptResponse[1];
  if (!gptFunctionCall.name) return;
  gptFunctionCall.arguments = JSON.parse(gptFunctionCall.arguments);
  switch (gptFunctionCall.name) {
    case "move_seat_horizontal":
      moveHorizontal(
        seat,
        mapValues(gptFunctionCall.arguments.distance) *
          (gptFunctionCall.arguments.direction ? 1 : -1),
      );
      say(getMessages);
      break;
    case "move_seat_vertical":
      moveVertical(
        seat,
        mapValues(gptFunctionCall.arguments.distance) *
          (gptFunctionCall.arguments.direction ? 1 : -1),
      );
      break;
    case "move_backrest":
      moveBackrest(
        seat,
        mapValues(gptFunctionCall.arguments.distance) *
          (gptFunctionCall.arguments.direction ? 1 : -1),
      );
      break;
    case "move_incline":
      moveIncline(
        seat,
        mapValues(gptFunctionCall.arguments.distance) *
          (gptFunctionCall.arguments.direction ? 1 : -1),
      );
      break;
    case "move_shoulder":
      moveShoulder(
        seat,
        mapValues(gptFunctionCall.arguments.distance) *
          (gptFunctionCall.arguments.direction ? 1 : -1),
      );
      break;
    case "set_size":
      setSize(seat, gptFunctionCall.arguments.size);
      break;
    case "enable_mode":
      enableMode(gptFunctionCall.arguments.mode);
      break;
    default:
      console.error("Undefined action!");
  }
};

const mapValues = (value: string) => {
  switch (value) {
    case "low":
      return 50;
    case "medium":
      return 120;
    case "high":
      return 255;
    default:
      return 0;
  }
};
