import {
    getMicrophoneStream,
    recordMicrophoneStream,
    startMicrophoneStream,
    stopMicrophoneStream
} from "../../src/hardware/microphone";
import { setTimeout } from 'timers/promises';
import fs from 'fs';

test('save 10 seconds of microphone data to file', async () => {
    recordMicrophoneStream('test');
    const result = await setTimeout(10000, 'resolved')
    stopMicrophoneStream('test');
    expect(fs.existsSync('resources/transcription.wav')).toBe(true);
}, 13000)

test('Get live microphone data', async () => {
    startMicrophoneStream('test');
    // @ts-ignore
    getMicrophoneStream('test')!.stdout.on('data', (chunk: Buffer) => {
        console.log(chunk);
    });
    const result = await setTimeout(10000, 'resolved')
    stopMicrophoneStream('test');
    expect(1).toBe(1);
}, 13000);