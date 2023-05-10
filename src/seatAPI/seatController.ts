import { requestHandler } from './requestHandler';
import { ErrorMessage} from "./errorResponse";

const enableMode = (mode: string) => {
    //or if we have to handle it => get mode settings from config.json
    return handleResponse(requestHandler('post', 'enableMode', { mode }));
}

const disableMode = (mode: string) => {
    //or if we have to handle it => get default settings(or how they were before mode activation) from config.json
    return handleResponse(requestHandler('post', 'disableMode', { mode }));
}

const moveForward = () => {
    return handleResponse(requestHandler('post', 'moveForward', {}));
}

const handleResponse = (response: Promise<any>) => {
    response.then(response => {
        console.log(response);
        return response;
    })
    .catch((e) => {
        return e;
    });
}

export default {
    enableMode,
    disableMode,
    moveForward
};