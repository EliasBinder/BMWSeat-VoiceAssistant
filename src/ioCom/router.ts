import wake from "./handlers/wake";

const handlers = [
    wake
]

export const handle = (msg: any) => {
    const obj = JSON.parse(msg);
    if (obj.hasOwnProperty('action')) {
        handlers[obj.action](obj);
    }
}