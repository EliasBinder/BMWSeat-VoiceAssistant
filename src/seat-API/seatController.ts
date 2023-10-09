import { requestHandler } from './requestHandler';
export const enableMode = async (mode: string) => {
    //or if we have to handle it => get mode settings from config.json
    const modes = {
        Parking: 'IN08-PARKMODE',
        Exit: 'IN09-EASYINOUT',
        Entry: 'IN09-EASYINOUT',
        Comfort: 'IN10-COMFORTMODE'
    }
    type modeType = 'Parking' | 'Exit' | 'Entry' | 'Comfort'
    let endpoint = '';
    if (Object.keys(modes).includes(mode))
        endpoint = modes[mode as modeType]
    else {
        console.error('Undefined mode')
        return
    }
    const promises = [];
    for (let _mode in modes) {
        promises.push(handleResponse(requestHandler(
            '/switch/vacust/' + modes[_mode as modeType] + '/' + (mode === _mode ? 'on' : 'off')
        )))
    }
    return Promise.all(promises)
}

export const moveHorizontal = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler('/seat/move/' + value))
}

export const moveBackrest = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler('/seat/recline/' + value))
}

export const setSize = async (seat: 'DS' | 'PS', value: 'S' | 'M' | 'L') => {
    const availSizes = ['S', 'M', 'L']
    const promises = [];
    for (let _size in availSizes) {
        promises.push(handleResponse(requestHandler(
            '/switch/vacust/IN11-SIZE-' + _size + '/' + (value === _size ? 'on' : 'off')
        )))
    }
    return Promise.all(promises)
}

export const moveShoulder = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler('/seat/shoulder/' + value))
}


const handleResponse = (response: Promise<any>) => {
    return response.then(response => {
        console.log(response);
        return response;
    })
    .catch((e) => {
        console.log('Error: ', e);
        throw e;
    });
}