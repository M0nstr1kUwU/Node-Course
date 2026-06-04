const express = require('express'); //imports
const socketio = require('socket.io');

const app = express();
app.use(express.static(__dirname + '/public')); // статичные файлы

const expressServer = app.listen(8000);  // запуск основного сервера

const io = socketio(expressServer); // запуск  на основном socket.io server 

io.on('connection', (socket) => {   // socket = client from connection

    socket.on("sendMessage", (data) => {
        console.log(data);
        io.sockets.emit("newMessage", {data});
    })
});