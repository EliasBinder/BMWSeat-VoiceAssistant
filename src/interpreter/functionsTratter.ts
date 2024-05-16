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
        name: "move_shoulder",
        description: "Move the shoulder part of the car seat forward or backward",
        parameters: {
            type: "object",
            properties: {
                direction: {
                    type: "boolean",
                    description: "The direction to move the shoulder part of the car seat. True for forward, false for backward.",
                },
                distance: {
                    type: "string",
                    description: "The distance the move the shoulder part forward or backward. Use one of the following values: 'low', 'medium' or 'high'."
                }
            },
            required: ["direction", "distance"]
        }
    },
    {
        name: "set_size",
        description: "Adjust the seat to the height of the user",
        parameters: {
            type: "object",
            properties: {
                size: {
                    type: "string",
                    description: "Height or size of the user. Must be 'S', 'M' or 'L'"
                }
            },
            required: ["size"]
        }
    },
    {
        name: "enable_mode",
        description: "Enables a mode. Modes are: Parking, EntryOrExit and Comfort. The EntryOrExit mode allows the user to get in and out of their seat more easily",
        parameters: {
            type: "object",
            properties: {
                mode: {
                    type: "string",
                    description: "The mode to enable. Must be 'Parking', 'EntryOrExit' or 'Comfort'",
                }
            },
            required: ["mode"],
        }
    }
]