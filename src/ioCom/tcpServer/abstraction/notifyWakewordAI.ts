import {clients} from "../serverSocket";

export default (flag: boolean) => {
    if (clients.has('WakewordAI'))
        clients.get('WakewordAI').write(JSON.stringify({
            type: 'action',
            action: 'listen',
            data: {
                flag
            }
        }));
    else
        console.error('📡 WakewordAI not connected');
}