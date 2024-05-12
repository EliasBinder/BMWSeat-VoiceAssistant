import openAI from "../config/openAI"
import fs from "fs"
import { playAudio } from "../hardware/speaker";

export const say = async (text: string) => {
    console.log("Saying: '" + text + "'");
    try {
        const response = await openAI.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text
        });
        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.promises.writeFile("resources/say.mp3", buffer);
        playAudio("resources/say.mp3")
    } catch (e) {
        console.error(e);
    }
}