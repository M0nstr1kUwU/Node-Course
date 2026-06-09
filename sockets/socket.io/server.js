const express = require('express');
const socketio = require('socket.io');

const app = express();
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(8000);

const io = socketio(expressServer);

io.on('connection', (socket) => {

    socket.on("sendMessage", (data) => {
        const text = data.data;
        const id = data.socket_id;
        console.log(id);
        io.sockets.emit("newMessage", {text: `${text}`, id: id});
    })
});