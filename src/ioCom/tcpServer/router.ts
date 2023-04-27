import wake from "./handlers/wake";

const handlers: any = {
    wake
}

export const handle = (obj: any) => {
    if (obj.hasOwnProperty('action')) {
        handlers[obj.action](obj);
    }
}