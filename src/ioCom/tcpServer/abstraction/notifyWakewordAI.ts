import {clients} from "../serverSocket";

export default () => {
    if (clients.has('WakewordAI'))
        clients.get('WakewordAI').write(JSON.stringify({type: 'action', action: 'listen'}));
    else
        console.error('📡 WakewordAI not connected');
}