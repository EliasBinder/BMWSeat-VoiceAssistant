import {getStream, stopStream} from "./hardware/microphone";
import fs from 'fs';

console.log('Hello World');

const stream = getStream();
const fileWriteStream = fs.createWriteStream('resources/test.wav');
stream.pipe(fileWriteStream);
setTimeout(() => {
    stream.unpipe(fileWriteStream);
    fileWriteStream.close();
    stopStream();
}, 10000);