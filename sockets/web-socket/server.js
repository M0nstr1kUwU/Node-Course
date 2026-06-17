// dependies
const http = require('http');
const websocket = require('ws');
// http server
const server = http.createServer((req, res) => {
    res.end('---------conected---------');
});
//web socket server
const wss = new websocket.WebSocketServer({ server });

//wss.on('headers', (headers, req) => { console.log(headers) });

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        console.log(message.toString());
    });
    ws.send('Client Hello!')
})

//запуск сервера
server.listen(8000, () => {
    console.log('http://localhost:8000');
});
