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
        name: "move_incline",
        description: "Change the inclination of the seating area",
        parameters: {
            type: "object",
            properties: {
                direction: {
                    type: "boolean",
                    description: "The direction of the inclination. True for up, false for down",
                },
                distance: {
                    type: "string",
                    description: "The distance to incline the seating area up or down. Use one of the following valued: 'low', 'medium' or 'high'.",
                }
            },
            required: ["direction", "distance"],
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
]