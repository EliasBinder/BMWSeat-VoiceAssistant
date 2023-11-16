
export const say = (text: string) => {
    fetch('http://localhost:3002/say', {
        method: 'POST',
        body: JSON.stringify({text}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .catch(console.error)
}