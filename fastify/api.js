
async function sendText(){
    const text = document
        .getElementById('input-text').value;
    const result = document.getElementById('result');
    
    res = await fetch("/api", {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text:text})
        }
    )
    
    data = await res.json();
    result.innerText = `${data.status}`;
    
}
