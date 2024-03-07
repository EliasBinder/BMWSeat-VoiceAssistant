import express from 'express';
import {wake} from "../../app";
import { say } from '../../text-to-speech/textToSpeech';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/wake', (req, res) => {
    console.log('📡 Wake');
    wake();
    res.send({status: 'ok'});
});

router.post('/say', (req, res) => {
    const bodyJson: any = req.body
    if (!bodyJson.hasOwnProperty("text")){
        res.status(400).send({error: "text is required"});
    }
    const text = bodyJson.text;
    say(text);
    res.send({status: 'ok'});
})

export default router;