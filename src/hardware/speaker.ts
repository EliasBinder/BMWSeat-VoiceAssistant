import Player from 'play-sound';
const player = Player();

export let currentAudio: any = null;

export const playAudio = (audioFileName: string) => {
    if (currentAudio)
        currentAudio.kill();
    currentAudio = player.play('resources/' + audioFileName);
}