import {getMicrophoneStream, recordMicrophoneStream, stopMicrophoneStream} from "../../src/hardware/microphone";
import { setTimeout } from 'timers/promises';
import fs from 'fs';

test('save 10 seconds of microphone data to file', async () => {
    recordMicrophoneStream('test');
    const result = await setTimeout(10000, 'resolved')
    stopMicrophoneStream('test');
    expect(fs.existsSync('resources/transcription.wav')).toBe(true);
}, 13000)