import { interpretMessage } from "../../src/interpreter/gptInterpreter";

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Ich bin müde!');
    console.log(resp);
    jest.runAllTimers();
}, 10000)

test('give a response/completion to a prompt', async () => {
    jest.setTimeout(1000);
    const resp = await interpretMessage('Das Wetter ist schön heute');
    console.log(resp);
    jest.runAllTimers();
}, 10000)