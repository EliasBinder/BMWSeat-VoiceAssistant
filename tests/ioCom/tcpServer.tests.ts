import { setTimeout } from 'timers/promises';
import serverSocket from "../../src/ioCom/tcpServer/serverSocket";

test('Run TCP Server for 30 seconds', async () => {
    serverSocket.createServer();
    const result = await setTimeout(30000, 'resolved')
    console.log('Please run WakewordAI-Client now!')
    expect(serverSocket.clients.has('WakewordAI')).toBe(true);
}, 33000);