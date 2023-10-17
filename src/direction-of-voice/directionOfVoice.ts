import {addCallback, removeCallback} from "../interrupts/interrupts";
const dovID = 1;

let stopAnalyzing = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        resolve(0)
    })
}

export const fetchDOV = () => {
    console.log('🎤 Fetching direction of voice');
    let sum = 0;
    let amount = 0;

    addCallback(dovID, (data: Buffer) => {
        const direction = data.readInt16BE(3);
        sum += direction < 180 ? 1 : -1;
        amount += 1;
        console.log('Dir;', direction, ' ; Average value: ', (sum / amount));
    });

    // set stopping function
    stopAnalyzing = async () => {
        removeCallback(dovID)
        return (sum / amount)
    }
}

export async function stopFetchDOV() {
    const result = await stopAnalyzing();
    stopAnalyzing = (): Promise<number> => {
        return new Promise((resolve, reject) => {
            resolve(0)
        })
    }
    return result;
}