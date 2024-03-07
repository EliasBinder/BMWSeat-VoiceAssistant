import {playAudio} from "../../src/hardware/speaker";
import { setTimeout } from 'timers/promises';

test('play audio file', async () => {
    playAudio('resources/say.mp3');
    await setTimeout(10000);
    expect(1).toBe(1)
}, 13000)