import {enableMode, incline, moveBackrest, moveHorizontal, moveVertical, strengthen} from "./seatController";

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
        case 'incline_seat':
            incline(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'strengthen_seat':
            strengthen(seat, 255 * (gptResponse.arguments.direction ? 1 : -1)); //FIXME: mapValues(gptResponse.arguments.strength));
            break;
        case 'enable_mode':
            enableMode(gptResponse.arguments.mode);
            break;
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