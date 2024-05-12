# API Specification

## Wake

The wake endpoint is used to trigger the voice assistant to wake up and start listening for a command.

Method: `GET` \
Endpoint: `{host}:3000/api/wake` \
Body: None

## Say

The say endpoint is used to make the voice assistant say something. By default,
the system will create a text to be said using the GPT model and output this
text over the speaker using OpenAI's Text-To-Speech (TTS) model. However, if
it is needed to say a specific text at any given time, independent from the voice assistent's current state, it can be passed in JSON for this endpoint.

Method: `POST` \
Endpoint: `{host}:3000/api/say` \
Body: `{"text": "Hello, world!"}`
