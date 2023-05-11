import express from 'express';
import {wake} from "../../app";
const router = express.Router();

let streamClients: any[] = [];

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/wake', (req, res) => {
    wake();
    res.send({status: 'ok'});
});

router.get('/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    })

    streamClients.push(res);

    req.on('close', () => {
        streamClients = streamClients.filter(client => client !== res);
    });
});

export const sendStreamData = (data: any) => {
    streamClients.forEach((client) => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

export default router;