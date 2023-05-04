import {transcribeFile, transcribeMicrophone, transcribeStream} from "../../src/speech-to-text/speech_to_text";
import fs from 'fs';
import {getStandaloneMicrophone, stopMicrophoneStream} from "../../src/hardware/microphone";
import {setTimeout} from "timers/promises";
import exp from "constants";

test('transcribe a .wav file to text', async () => {
    // ATTENTION: enable when needed only

    const text = await transcribeFile('resources/harvard.wav');
    expect(fs.existsSync('resources/harvard.wav')).toBe(true);
    expect(text).toBe("The stale smell of old beer lingers. It takes heat to bring out the odor. A cold dip restores health and zest. A salt pickle tastes fine with ham. Tacos al pastor are my favorite. A zestful food is the hot cross bun.");
    jest.runAllTimers();
}, 10000)

test('transcribe a microphone stream to text for 10 seconds', async () => {

    const text = transcribeMicrophone().then((text) => {

    })
}, 14000)