import {handle} from "./router";

const net = require('net');
const port = 5000;
const host = '127.0.0.1';

export const clients = new Map<string, any>();

const createServer = () => {
    const server = net.createServer();
    server.listen(port, host, () => {
        console.log(`📡 TCP Control Server is listening on ${host}:${port}`);
    });

    server.on('connection', (socket: any) => {
        socket.on('data', (data: any) => {
            const parsedData = JSON.parse(data.toString());
            if (parsedData.hasOwnProperty('type')){
                switch (parsedData.type) {
                    case 'handshake':
                        if (parsedData.hasOwnProperty('role')) {
                            clients.set(parsedData.role, socket);
                            console.log(`📡 ${parsedData.role} connected`);
                        } else {
                            console.error('📡 Could not register client! No role specified in handshake message!');
                        }
                        break;
                    case 'action':
                        handle(parsedData);
                        break;
                }
            }
        });

        socket.on('end', () => {
            clients.forEach((value: any, key: string) => {
                if (value === socket) {
                    clients.delete(key);
                    console.log(`📡 ${key} disconnected`);
                }
            });
        });
    });
}

export default {
    createServer,
    clients
};