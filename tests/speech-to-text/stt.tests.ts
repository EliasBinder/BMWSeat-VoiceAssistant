import {stopTranscriptionMicrophone, transcribeMicrophone} from "../../src/speech-to-text/speechToText";
import {setTimeout} from "timers/promises";
import exp from "constants";


test('transcribe a microphone stream to text for 10 seconds. Please say: "Move my seat forward"', async () => {
    transcribeMicrophone();
    await setTimeout(5000, 'resolved');
    const result = await stopTranscriptionMicrophone();
    console.log('-------------------------------------------------');
    console.log('result: ' + result);
    console.log('-------------------------------------------------');
    expect(result).toBe('Move my seat forward.');
}, 7000)