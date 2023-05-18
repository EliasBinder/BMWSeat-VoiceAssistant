import {fetchMicrophoneInterrupts} from "../../src/direction-of-voice/direction_of_voice";
import {setTimeout} from "timers/promises";

test('log usb interrupts for microphone', async () => {
    fetchMicrophoneInterrupts();
    const result = await setTimeout(15000, 'resolved')
}, 17000);