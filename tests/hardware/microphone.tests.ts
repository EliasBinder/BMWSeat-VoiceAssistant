import {getStream, stopStream} from "../../src/hardware/microphone";
import fs from 'fs';

test('save 10 seconds of microphone data to file', async () => {
    jest.setTimeout(11000);
    const stream = getStream();
    const fileWriteStream = fs.createWriteStream('resources/test.wav');
    stream.pipe(fileWriteStream);
    setTimeout(() => {
        stream.unpipe(fileWriteStream);
        fileWriteStream.close();
        stopStream();
        expect(fs.existsSync('test.wav')).toBe(true);
    }, 10000);
    jest.runAllTimers();
})