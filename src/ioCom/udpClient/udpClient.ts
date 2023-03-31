import dgram from 'dgram';
const client = dgram.createSocket('udp4');

export const sendPacketToWakewordAI = (packet: any) => {
    client.send(packet, 5001, '127.0.0.1', (err: any) => {
        if (err) {
            console.error('Error sending packet to wakeword AI: ' + err);
        }
    });
}

export const sendPacketToLocalSpeechToText = (packet: any) => {
    client.send(packet, 5002, '127.0.0.1', (err: any) => {
        if (err) {
            console.error('Error sending packet to local speech to text: ' + err);
        }
    });
}