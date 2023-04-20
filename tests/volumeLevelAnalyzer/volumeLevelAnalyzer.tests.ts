import {getMicrophoneStream} from "../../src/hardware/microphone";
import {analyzeStream} from "../../src/volumeLevelAnalyzer/volumeLevelAnalyzer";
import { setTimeout } from 'timers/promises';

test('Analyze volume level', async () => {
    analyzeStream(() => {}, () => {});
    const result = await setTimeout(30000, 'resolved')
    expect(1).toBe(1);
}, 33000);