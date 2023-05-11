import { interpretMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Stelle meinen Sitz ganz nach vorne.');
    expect(resp[0]).not.toBe(null);
    console.log(resp);
    expect(JSON.stringify(resp[0])).toBe('{"message":"Seat forward","value":1}');
    jest.runAllTimers();
}, 10000)