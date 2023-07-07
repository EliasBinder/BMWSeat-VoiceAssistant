import { requestHandler } from './requestHandler';
import { ErrorMessage} from "./errorResponse";

//TODO: implement according to the API documentation

export const enableMode = (mode: string) => {
    //or if we have to handle it => get mode settings from config.json
    return handleResponse(requestHandler({ mode }));
}

export const moveHorizontal = (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#01#' + (value > 0 ? 'p' : 'n') + value
    }));
}

export const moveVertical = (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#02#' + (value > 0 ? 'p' : 'n') + value
    }));
}

export const moveBackrest = (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#03#' + (value > 0 ? 'p' : 'n') + value
    }));
}

export const strengthen = (seat: 'DS' | 'PS', value: number) => {
    return handleResponse(requestHandler({
        HexId: "73636531",
        Input: seat + '#04#' + (value > 0 ? 'p' : 'n') + value
    }));
}

const handleResponse = (response: Promise<any>) => {
    return response.then(response => {
        console.log(response);
        return response;
    })
    .catch((e) => {
        return e;
    });
}