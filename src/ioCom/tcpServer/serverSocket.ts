import {handle} from "./router";

const net = require('net');
const port = 5000;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
    console.log(`📡 Server is listening on ${host}:${port}`);
});

export const clients = new Map<string, any>();

server.on('connection', (socket: any) => {
    socket.on('data', (data: any) => {
        const parsedData = JSON.parse(data);
        if (parsedData.hasOwnProperty('type')){
            switch (parsedData.type) {
                case 'handshake':
                    if (parsedData.hasOwnProperty('role')) {
                        clients.set(parsedData.role, socket);
                        console.log(`📡 ${parsedData.role} connected`);
                    }
                    break;
                case 'action':
                    handle(parsedData);
                    break;
            }
        }
    });
    socket.on('end', () => {});
});

export default {
    server,
    clients
};