import {InEndpoint, findByIds, getDeviceList, usb} from "usb";
import {setDebugLevel} from "usb/dist/usb";


const VENDOR_ID = 0x2752;
const PRODUCT_ID = 0x1C;

const device = findByIds(VENDOR_ID, PRODUCT_ID);

export const fetchMicrophoneInterrupts = () => {
    setDebugLevel(4)
    if(device) {
        console.log('Device found');
        device.open();

        //Claim the interface
        const deviceInterface = device.interface(4);
        if (!deviceInterface) {
            console.log('Interface not found');
            return;
        }
        let isKernelDriverActive = false;
        if (deviceInterface.isKernelDriverActive()){
            isKernelDriverActive = true;
            deviceInterface.detachKernelDriver();
        }
        deviceInterface.claim();

        //Get the endpoint
        const endpoint = deviceInterface.endpoint(0x83) as InEndpoint;
        if (!endpoint) {
            console.log('Endpoint not found');
            return;
        }
        const isInterruptEndpoint = endpoint.direction === 'in' && endpoint.transferType === usb.LIBUSB_TRANSFER_TYPE_INTERRUPT;

        //Monitor the endpoint
        if (isInterruptEndpoint) {
            let timeout: NodeJS.Timeout | null = null;

            console.log("The specified enpoint is an interrupt endpoint.");
            // Start listening for interrupts
            endpoint.startPoll(1, endpoint.descriptor.wMaxPacketSize);
            endpoint.addListener('data', (data) => {
                if (timeout == null && data[0] === 0x06 && data[1] === 0x36) {
                    const direction = data.readInt16LE(3);
                    const direction2 = data.readInt8(5);
                    console.log('Received direction1: ', direction, ' direction2: ', direction2);
                    timeout = setTimeout(() => {
                        timeout = null;
                    }, 50);
                }
            });
            endpoint.addListener('error', (err) => {
                console.log('err: ', err)
            });
        } else {
            console.log('The specified endpoint is not an interrupt endpoint.');
        }

        return [endpoint, deviceInterface, isKernelDriverActive];
    }else {
        console.log('Device not found');
    }
}