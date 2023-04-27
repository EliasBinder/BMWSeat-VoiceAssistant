import { interpretMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Say this is a test.');
    expect(resp).not.toBe(null);
    console.log(resp);
    expect(resp.message).toBe("This is a test.");
    jest.runAllTimers();
}, 10000)