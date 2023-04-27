import {wake} from "../../../app";

export default (msg: any) => {
    console.log('📡 Wake command received')
    wake();
}