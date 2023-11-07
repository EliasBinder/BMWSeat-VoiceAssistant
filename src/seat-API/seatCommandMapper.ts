import {
    enableMode,
    moveBackrest,
    moveVertical,
    moveShoulder,
    setSize,
    moveHorizontal,
    moveIncline
} from "./seatController";

export const processResponse = (gptResponse: any, seat: 'DS' | 'PS') => {
    if (!gptResponse.name)
        return;
    gptResponse.arguments = JSON.parse(gptResponse.arguments);
    switch (gptResponse.name) {
        case 'move_seat_horizontal':
            moveHorizontal(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'move_seat_vertical':
            moveVertical(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'move_backrest':
            moveBackrest(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'move_incline':
            moveIncline(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'move_shoulder':
            moveShoulder(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'set_size':
            setSize(seat, gptResponse.arguments.size);
            break;
        case 'enable_mode':
            enableMode(gptResponse.arguments.mode);
            break;
        default:
            console.error("Undefined action!");
    }
}

const mapValues = (value: string) => {
    switch (value) {
        case 'low':
            return 50;
        case 'medium':
            return 120;
        case 'high':
            return 255;
        default:
            return 0;
    }
}