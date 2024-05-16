export const getErrorMsg = (lang: 'en'|'de'|'it'): string => {
    const errorMessages = {
        en: "I'm having a problem in understanding you. Please start by saying 'hyper', then say what you want to do, by how many centimeters, and in which direction (forward or backward). For example: 'hyper move seat 8 centimeters forward'.",
        de: "Ich habe dich nicht richtig verstanden. Bitte beginnen Sie mit 'hyper', dann sagen Sie, was Sie tun möchten, um wie viele Zentimeter und in welche Richtung (vorwärts oder rückwärts). Zum Beispiel: 'hyper Sitz bewegen 8 Zentimeter vorwärts'.",
        it: "Non ti ho capito bene. Per favore inizia dicendo 'hyper', poi di' cosa vuoi fare, di quanti centimetri e in quale direzione (avanti o indietro). Per esempio: 'hyper sposta il sedile di 8 centimetri in avanti'.",
    };
    return errorMessages[lang];
}