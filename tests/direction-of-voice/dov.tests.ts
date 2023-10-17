import { Endpoint, InEndpoint } from "usb";
import {fetchDOV, stopFetchDOV} from "../../src/direction-of-voice/directionOfVoice";
import {setTimeout} from "timers/promises";

test('log usb interrupts for microphone', async () => {
    fetchDOV();
    await setTimeout(10000, 'resolved');
    const result = await stopFetchDOV();
    expect(result).toBeGreaterThan(-1);
    expect(result).toBeLessThan(1);
    console.log(result);
}, 33000);