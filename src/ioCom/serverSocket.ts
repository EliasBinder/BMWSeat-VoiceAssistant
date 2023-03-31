const net = require('net');
const port = 5000;
const host = '127.0.0.1';

const server = net.createServer();
server.listen(port, host, () => {
    console.log(`📡 Server is listening on ${host}:${port}`);
});

server.on('connection', (socket: any) => {
    socket.on('data', (data: any) => {
        console.log(`?? Data received from client: ${data}`);
    });
    socket.on('end', () => {});
});

export default server;