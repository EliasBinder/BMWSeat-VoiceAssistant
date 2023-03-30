import { interpreteMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpreteMessage('Say this is a test.');
    expect(resp).not.toBe(null);
    expect(resp).toBe("This is a test.");
    jest.runAllTimers();
}, 10000)