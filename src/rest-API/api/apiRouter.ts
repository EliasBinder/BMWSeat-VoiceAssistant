import express from 'express';
import {wake} from "../../app";
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/wake', (req, res) => {
    console.log('📡 Wake');
    wake();
    res.send({status: 'ok'});
});

export default router;