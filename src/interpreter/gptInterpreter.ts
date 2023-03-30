import openAI from "../singelton/OpenAI";

export async function interpreteMessage(prompt: string){

    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        max_tokens: 4000,
        temperature: 0,
    });
    return response.data.choices[0].message.content;
}