import { requestHandler } from './requestHandler';

//TODO: implement according to the API documentation

export const enableMode = async (mode: string) => {
    //or if we have to handle it => get mode settings from config.json
    return handleResponse(requestHandler({mode}));
}

export const moveHorizontal = async (seat: 'DS' | 'PS', value: number) => {
    console.log('x', seat + '#01#' + (value > 0 ? 'p' : 'n') + value)
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#01#' + (value > 0 ? 'p' : 'n') + value
    }))
        .then((response) => {
            setTimeout(() => {
                console.log('Stopping motor')
                handleResponse(requestHandler({
                    HexId: "73636531",
                    Input: seat + '#00#p0'
                }));
            }, 4000);
            return response;
        });
}

export const moveVertical = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#02#' + (value > 0 ? 'p' : 'n') + value
    }))
        .then((response) => {
            setTimeout(() => {
                console.log('Stopping motor')
                handleResponse(requestHandler({
                    HexId: "73636531",
                    Input: seat + '#00#p0'
                }));
            }, 4000);
            return response;
        });
}

export const moveBackrest = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#03#' + (value > 0 ? 'p' : 'n') + value
    }))
        .then((response) => {
            setTimeout(() => {
                console.log('Stopping motor')
                handleResponse(requestHandler({
                    HexId: "73636531",
                    Input: seat + '#00#p0'
                }));
            }, 4000);
            return response;
        });
}

export const incline = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#04#' + (value > 0 ? 'p' : 'n') + value
    }))
        .then((response) => {
            setTimeout(() => {
                console.log('Stopping motor')
                handleResponse(requestHandler({
                    HexId: "73636531",
                    Input: seat + '#00#p0'
                }));
            }, 4000);
            return response;
        });
}

export const strengthen = async (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#05#' + (value > 0 ? 'p' : 'n') + value
    }));
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