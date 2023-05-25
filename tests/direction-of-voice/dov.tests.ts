import { Endpoint, InEndpoint } from "usb";
import {fetchMicrophoneInterrupts} from "../../src/direction-of-voice/direction_of_voice";
import {setTimeout} from "timers/promises";

test('log usb interrupts for microphone', async () => {
    const [endpoint, deviceInterface, isKernelDriverActive] = fetchMicrophoneInterrupts();
    const result = await setTimeout(15000, 'resolved')
    endpoint?.stopPoll()

    deviceInterface.release(() => {
        if (isKernelDriverActive) {
            deviceInterface.attachKernelDriver();
        }
    })
}, 17000);