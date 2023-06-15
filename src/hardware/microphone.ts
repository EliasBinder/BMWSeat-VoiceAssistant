import {ChildProcess} from "child_process";

const { spawn } = require('child_process');

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
    // @ts-ignore
    processes.get(name).kill();
    processes.delete(name);
}