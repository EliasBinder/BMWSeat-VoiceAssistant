import {findByIds, getDeviceList, usb} from "usb";
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
        console.log(device.interfaces)
        const deviceInterface = device.interface(4);
        if (!deviceInterface) {
            console.log('Interface not found');
            return;
        }
        deviceInterface.claim();

        //Get the endpoint
        const endpoint = deviceInterface.endpoint(0x83);
        if (!endpoint) {
            console.log('Endpoint not found');
            return;
        }
        const isInterruptEndpoint = endpoint.direction === 'in' && endpoint.transferType === usb.LIBUSB_TRANSFER_TYPE_INTERRUPT;

        //Monitor the endpoint
        if (isInterruptEndpoint) {
            // Start listening for interrupts
            endpoint.eventNames()
        } else {
            console.log('The specified endpoint is not an interrupt endpoint.');
        }
    }else {
        console.log('Device not found');
    }
}