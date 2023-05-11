import {transcribeMicrophone} from "../../src/speech-to-text/speech_to_text";
import fs from 'fs';
import {getStandaloneMicrophone, stopMicrophoneStream} from "../../src/hardware/microphone";
import {setTimeout} from "timers/promises";
import exp from "constants";

//FIXME : update this test
// test('transcribe a microphone stream to text for 10 seconds', async () => {
//
//     const text = transcribeMicrophone().then((text) => {
//
//     })
// }, 14000)