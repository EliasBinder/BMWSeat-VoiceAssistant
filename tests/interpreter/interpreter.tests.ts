import { interpretMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Move my seat forward.');
    expect(resp).not.toBe(null);
    console.log(resp);
    expect(resp.message).toBe("Seat forward");
    jest.runAllTimers();
}, 10000)