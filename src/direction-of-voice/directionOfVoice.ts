import {InEndpoint, findByIds, getDeviceList, usb, Interface} from "usb";
import {setDebugLevel} from "usb/dist/usb";


const VENDOR_ID = 0x2752;
const PRODUCT_ID = 0x1C;

const device = findByIds(VENDOR_ID, PRODUCT_ID);

let stopAnalyzing = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        resolve(0)
    })
}

export const fetchMicrophoneInterrupts = () => {
    let sum = 0;
    let amount = 0;

    let endpoint: InEndpoint | null = null;
    let deviceInterface: Interface | null = null;
    let isKernelDriverActive = false;

    //setDebugLevel(4)
    if(device) {
        console.log('Device found');
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
            console.log("The specified enpoint is an interrupt endpoint.");
            // Start listening for interrupts
            endpoint.startPoll(1, endpoint.descriptor.wMaxPacketSize);
            endpoint.addListener('data', (data) => {
                if (data[0] === 0x06 && data[1] === 0x36) {
                    const direction = data.readInt16BE(3);
                    sum += direction < 180 ? 1 : -1;
                    amount += 1;
                    console.log('Dir;', direction, ' ; Average value: ', (sum / amount));
                }
            });
            endpoint.addListener('error', (err) => {
                console.log('err: ', err)
                //TODO restart on error
            });
        } else {
            console.log('The specified endpoint is not an interrupt endpoint.');
        }
    }else {
        console.log('Device not found');
    }

    // set stopping function
    stopAnalyzing = async () => {
        if (endpoint)
            endpoint.stopPoll();
        if (deviceInterface)
            deviceInterface.release(() => {
                if (isKernelDriverActive) {
                    deviceInterface?.attachKernelDriver();
                }
            });
        return (sum / amount)
    }
}

export async function stopFetchMicrophoneInterrupts() {
    const result = await stopAnalyzing();
    stopAnalyzing = (): Promise<number> => {
        return new Promise((resolve, reject) => {
            resolve(0)
        })
    }
    return result;
}