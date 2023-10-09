import {enableMode, moveBackrest, moveHorizontal, moveShoulder, setSize} from "./seatController";

export const processResponse = (gptResponse: any, seat: 'DS' | 'PS') => {
    if (!gptResponse.name)
        return;
    gptResponse.arguments = JSON.parse(gptResponse.arguments);
    switch (gptResponse.name) {
        case 'move_seat_horizontal':
            moveHorizontal(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'move_backrest':
            moveBackrest(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'move_sholder':
            moveShoulder(seat, mapValues(gptResponse.arguments.distance) * (gptResponse.arguments.direction ? 1 : -1));
            break;
        case 'set_size':
            setSize(seat, gptResponse.arguments.size);
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