#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="mac"
elif [[ "$OSTYPE" == "cygwin" ]]; then
        # POSIX compatibility layer and Linux environment emulation for Windows
        OS="linux"
elif [[ "$OSTYPE" == "msys" ]]; then
        # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
        OS="linux"
elif [[ "$OSTYPE" == "win32" ]]; then
        # I'm not sure this can happen.
        OS="windows"
elif [[ "$OSTYPE" == "freebsd"* ]]; then
        OS="linux"
fi

if [ "$OS" == "linux" ]; then
        # Linux
        arecord -c 1 -r 16 -f S16_LE -D default
elif [ "$OS" == "mac" ]; then
        # Mac
        rec -q -b 16 -c 1 -r 16000 -e unsigned-integer -t wav -
fi