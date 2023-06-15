import {ChildProcess} from "child_process";
const terminate = require('terminate');


const { spawn, exec } = require('child_process');

let processes: Map<string, ChildProcess> = new Map<string, ChildProcess>

export const startMicrophoneStream = (name: string) => {
    processes.set(name, spawn('bash', ['resources/child-processes/mic-stream.sh']));
}

export const recordMicrophoneStream = (name: string) => {
    processes.set(name, spawn('bash', ['resources/child-processes/mic-recording.sh']));
}

export const getMicrophoneStream = (name: string) => {
    return processes.get(name);
}

export const stopMicrophoneStream = (name: string) => {
    if (!processes.has(name)) return;
    const pid = processes.get(name)!.pid;
    // @ts-ignore
    terminate(pid, function (err) {
        if (err) { // you will get an error if you did not supply a valid process.pid
            console.log('Oopsy:', err); // handle errors in your preferred way.
        }
        else {
            console.log('done'); // terminating the Processes succeeded.
            // NOTE: The above won't be run in this example as the process itself will be killed before.
        }
    });
    processes.delete(name);
}