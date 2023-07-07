//handle sending requests to the API with axios
//@TODO define params type for axios

import axios from 'axios';
import config from '../../config.json';

export const requestHandler = async (params: any) => {
    try {
        const response = await axios({
            method: 'post',
            url: config.Seat_API_Endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Grpc-Metadata-Authorization': config.Seat_API_Authorization
            },
            data: { ...params }
        });
        return response.data;
    } catch (e) {
        console.log('Error: ', e);
        throw e;
    }
}