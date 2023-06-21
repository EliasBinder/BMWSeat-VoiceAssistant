import { interpretMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('I cannot reach the pedals!');
    console.log(resp);
    jest.runAllTimers();
}, 10000)

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Seat forward');
    console.log(resp);
    jest.runAllTimers();
}, 10000)