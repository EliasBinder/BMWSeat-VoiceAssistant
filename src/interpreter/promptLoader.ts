import fs from "fs";
import path from "path";

let promptBefore = '';
let promptAfter = '';

const loadPromptBefore = () => {
    return fs.readFileSync('resources/promptBeforeNewCommands.txt', 'utf8');
}

const loadPromptAfter = () => {
    return fs.readFileSync('resources/promptAfterNewCommands.txt', 'utf8');
}
export const getPromptBefore = () => {
    if (promptBefore === '')
        promptBefore = loadPromptBefore();
    return promptBefore;
}

export const getPromptAfter = () => {
    if (promptAfter === '')
        promptAfter = loadPromptAfter();
    return promptAfter;
}