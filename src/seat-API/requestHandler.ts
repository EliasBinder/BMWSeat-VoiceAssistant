//handle sending requests to the API with axios
//@TODO define params type for axios

import axios from 'axios';
import config from '../../config.json';

export const requestHandler = async (endpoint: string) => {
    try {
        const response = await axios({
            method: 'get',
            url: config.Seat_API_Endpoint + endpoint,
            headers: {
                'Grpc-Metadata-Authorization': config.Seat_API_Authorization
            }
        });
        return response.data;
    } catch (e) {
        console.log('Error: ', e);
        throw e;
    }
}