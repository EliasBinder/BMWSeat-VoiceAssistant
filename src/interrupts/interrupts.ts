import {findByIds, InEndpoint, Interface, usb} from "usb";

const VENDOR_ID = 0x2752;
const PRODUCT_ID = 0x1C;

const device = findByIds(VENDOR_ID, PRODUCT_ID);

let callbacks = new Map<number, Function>();

export const addCallback = (id: number, callback: Function) => {
    callbacks.set(id, callback);
}

export const removeCallback = (id: number) => {
    callbacks.delete(id);
}

export const startAnalyzing = () => {
    let endpoint: InEndpoint | null = null;
    let deviceInterface: Interface | null = null;
    let isKernelDriverActive = false;

    if(device) {
        console.log('Microphone found');
        device.open();

        //Claim the interface
        deviceInterface = device.interface(4);
        if (!deviceInterface) {
            console.log('Interface not found');
            return;
        }
        if (deviceInterface.isKernelDriverActive()){
            isKernelDriverActive = true;
            deviceInterface.detachKernelDriver();
        }
        deviceInterface.claim();

        //Get the endpoint
        endpoint = deviceInterface.endpoint(0x83) as InEndpoint;
        if (!endpoint) {
            console.log('Endpoint not found');
            return;
        }
        const isInterruptEndpoint = endpoint.direction === 'in' && endpoint.transferType === usb.LIBUSB_TRANSFER_TYPE_INTERRUPT;

        //Monitor the endpoint
        if (isInterruptEndpoint) {
            // Start listening for interrupts
            endpoint.startPoll(1, endpoint.descriptor.wMaxPacketSize);
            endpoint.addListener('data', (data) => {
                if (data[0] === 0x06 && data[1] === 0x36) {
                    callbacks.forEach((elem) => {
                        elem(data);
                    });
                }
            });
            endpoint.addListener('error', (err) => {
                console.log('err: ', err)
                //TODO restart on error
            });
        } else {
            console.log('The specified endpoint is not an interrupt endpoint.');
        }
    } else {
        console.log('Microphone not found');
    }
}