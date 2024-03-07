#!/bin/bash

# Check if the audio file path is provided as a parameter
if [ $# -eq 0 ]; then
    echo "Please provide the file path of the audio as a parameter."
    exit 1
fi

# Get the audio file path from the parameter
audio_file="$1"

# Check if the audio file exists
if [ ! -f "$audio_file" ]; then
    echo "The audio file does not exist."
    exit 1
fi

# Play the audio using aplay
ffplay -v 0 -nodisp -autoexit "$audio_file"