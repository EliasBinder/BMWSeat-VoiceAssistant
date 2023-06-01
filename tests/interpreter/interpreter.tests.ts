import { interpretMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Die Pedale sind etwas zu weit weg.');
    expect(resp[0]).not.toBe(null);
    console.log(resp);
    expect(JSON.stringify(resp[0])).toBe('{"message":"Seat forward","value":"low"}');
    jest.runAllTimers();
}, 10000)

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Das Wetter ist schön heute');
    expect(resp[0]).not.toBe(null);
    console.log(resp);
    expect(JSON.stringify(resp[0])).toBe('{"message":"No match found","value":null}');
    jest.runAllTimers();
}, 10000)