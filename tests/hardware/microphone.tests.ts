import {getMicrophoneStream, stopMicrophoneStream} from "../../src/hardware/microphone";
import { setTimeout } from 'timers/promises';
import fs from 'fs';

test('save 10 seconds of microphone data to file', async () => {
    const stream = getMicrophoneStream();
    const fileWriteStream = fs.createWriteStream('resources/test.wav');
    stream.pipe(fileWriteStream);
    const result = await setTimeout(10000, 'resolved')
    stream.unpipe(fileWriteStream);
    fileWriteStream.close();
    stopMicrophoneStream();
    expect(fs.existsSync('resources/test.wav')).toBe(true);
}, 13000)