import openAI from "../config/openAI";

export async function interpretMessage(userInput: string){
    const response = await openAI.openai.createChatCompletion({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {role: "system", content: "You are a helpful assistant that can move a car seat. " +
                    "You can move the seat forward, backward, up, down, and adjust the backrest. " +
                    "You can also select a predefined mode for the seat. The predefined modes are relax, sleep and drive. " +
                    "The user may not express his request directly, but instead may express the current circumstances which he is not happy with."},
            {role: "user", content: userInput},
        ],
        functions: [
            {
                name: "move_seat_horizontal",
                description: "Moves the car seat forward or backward",
                parameters: {
                    type: "object",
                    properties: {
                        direction: {
                            type: "boolean",
                            description: "The direction to move the car seat. True for forward, false for backward",
                        },
                        distance: {
                            type: "string",
                            description: "The distance to move the car seat forward or backward. Use one of the following valued: 'low', 'medium' or 'high'.",
                        }
                    },
                    required: ["direction", "distance"],
                }
            },
            {
                name: "move_seat_vertical",
                description: "Moves the car seat up or down",
                parameters: {
                    type: "object",
                    properties: {
                        direction: {
                            type: "boolean",
                            description: "The direction to move the car seat. True for up, false for down",
                        },
                        distance: {
                            type: "string",
                            description: "The distance to move the car seat up or down. Use one of the following valued: 'low', 'medium' or 'high'.",
                        }
                    },
                    required: ["direction", "distance"],
                }
            },
            {
                name: "move_backrest",
                description: "Moves the backrest of the car seat forward or backward",
                parameters: {
                    type: "object",
                    properties: {
                        direction: {
                            type: "boolean",
                            description: "The direction to move the car seat. True for forward, false for backward",
                        },
                        distance: {
                            type: "string",
                            description: "The distance to move the backrest forward or backward. Use one of the following valued: 'low', 'medium' or 'high'.",
                        }
                    },
                    required: ["direction", "distance"],
                }
            },
            {
                name: "strengthen_seat",
                description: "Makes the car seat tighter or looser",
                parameters: {
                    type: "object",
                    properties: {
                        distance: {
                            type: "boolean",
                            description: "Make the car seat tighter or looser. Use TRUE for making it tighter and FALSE for making it looser",
                        }
                    },
                    required: ["distance"],
                }
            },
            {
                name: "enable_mode",
                description: "Enables a mode. Modes are: Relax, Driving and Sleeping",
                parameters: {
                    type: "object",
                    properties: {
                        mode: {
                            type: "string",
                            description: "The mode to enable. Must be 'Relax', 'Driving' or 'Sleeping'",
                        }
                    },
                    required: ["mode"],
                }
            }

        ],
        function_call: "auto"
    });

    const completion = response.data.choices[0].message

    return completion.function_call;
}