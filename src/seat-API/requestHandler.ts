//handle sending requests to the API with axios
//@TODO define params type for axios

import axios from 'axios';
import config from '../../config.json';

export const requestHandler = async (method: string, endpoint: string, params: any) => {
    try {
        const response = await axios({
            method: method,
            url: config.Seat_API_Endpoint + endpoint,
            //maybe need to add some params here
            data: { ...params }
        });
        return response.data;
    } catch (e) {
        console.log('Error: ', e);
        return e;
    }
}