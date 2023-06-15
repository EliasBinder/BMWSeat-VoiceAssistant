import {analyzeStream} from "./volume-level-analyzer/volumeLevelAnalyzer";
import {stopTranscriptionMicrophone, transcribeMicrophone} from "./speech-to-text/speechToText";

//Test 2 simultaneous mic stream usages

analyzeStream(() => {
    console.log('stopped speaking......');
})

transcribeMicrophone();
console.log('running');

setTimeout(() => {
    stopTranscriptionMicrophone().then(r =>
        console.log('Transcription: ', r)
    );
}, 5000)