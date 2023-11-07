import {moveVertical} from "../../src/seat-API/seatController";

test('Move seat vertical', async () => {
    await moveVertical('DS', -50)
        .then((response) => {
            console.log('Response: ');
            console.log(JSON.stringify(response));
            //@ts-ignore
            expect(response.Output.substring(0, 47)).toBe('OK-STATUS#BMWCS-HYP1: #0xC8-CONFIRMED DS#01#p50');
        });
})