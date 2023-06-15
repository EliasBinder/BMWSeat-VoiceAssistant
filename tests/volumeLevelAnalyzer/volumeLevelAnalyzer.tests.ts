import {getMicrophoneStream} from "../../src/hardware/microphone";
import {analyzeStream} from "../../src/volume-level-analyzer/volumeLevelAnalyzer";
import { setTimeout as _setTimeout } from 'timers/promises';

test('Analyze volume level', async () => {
    analyzeStream( () => {
        console.log('🎤 System is not listening...');
    });
    const result = await _setTimeout(10000, 'resolved')
    expect(1).toBe(1);
}, 13000);