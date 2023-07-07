import {moveHorizontal} from "../../src/seat-API/seatController";

test('Move seat vertical', () => {
    moveHorizontal('DS', 50)
        .then((response) => {
            console.log('Response: ');
            console.log(JSON.stringify(response));
            expect(response).toBe('OK');
        });
})