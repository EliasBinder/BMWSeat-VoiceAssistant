// cached config in Nodejs see: https://medium.com/swlh/node-js-and-singleton-pattern-7b08d11c726a
import {Configuration, OpenAIApi} from "openai";
import config from "../../config.json";

class OpenAI {
    public openai: any;
    constructor() {
        const api_config:Configuration = new Configuration({
            apiKey: config.OpenAI_API_Key,
        });

        this.openai = new OpenAIApi(api_config);
    }
}

export default new OpenAI();