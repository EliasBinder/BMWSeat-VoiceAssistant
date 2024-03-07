const { spawn } = require('child_process');

export const playAudio = (audioFileName: string) => {
    spawn('bash', ['resources/child-processes/speaker.sh', audioFileName])
}