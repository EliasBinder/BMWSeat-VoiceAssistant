export default [
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
        description: "Enables a mode. Modes are: Parking, Exit, Entry and Comfort. The Entry and Exit mode allow the user to get in and out of their seat more easily",
        parameters: {
            type: "object",
            properties: {
                mode: {
                    type: "string",
                    description: "The mode to enable. Must be 'Parking', 'Exit', 'Entry' or 'Comfort'",
                }
            },
            required: ["mode"],
        }
    }
]