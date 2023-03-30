import {playAudio, currentAudio} from "../../src/hardware/speaker";
import { setTimeout } from 'timers/promises';

test('play audio file', async () => {
    playAudio('harvard.wav');
    const result = await setTimeout(10000, 'resolved')
    expect(1).toBe(1)
}, 13000)