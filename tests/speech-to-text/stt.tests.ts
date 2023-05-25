import {stopTranscriptionMicrophone, transcribeMicrophone} from "../../src/speech-to-text/speechToText";
import fs from 'fs';
import {getStandaloneMicrophone, stopMicrophoneStream} from "../../src/hardware/microphone";
import {setTimeout} from "timers/promises";
import exp from "constants";


test('transcribe a microphone stream to text for 10 seconds. Please say: "Move my seat forward"', async () => {
    transcribeMicrophone();
    await setTimeout(10000, 'resolved');
    const result = await stopTranscriptionMicrophone();
    expect(result).toBe('Move my seat forward');
}, 14000)