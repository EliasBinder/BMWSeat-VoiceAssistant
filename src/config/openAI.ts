// cached config in Nodejs see: https://medium.com/swlh/node-js-and-singleton-pattern-7b08d11c726a
import OpenAI from "openai";
import config from "../../config.json";

export default new OpenAI({
  apiKey: config.OpenAI_API_Key,
});
