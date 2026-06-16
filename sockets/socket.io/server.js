const express = require("express"); //imports
const socketio = require("socket.io");

const app = express();
app.use(express.static(__dirname + "/public")); // ��������� �����

const expressServer = app.listen(8000); // ������ ��������� �������

const io = socketio(expressServer); // ������  �� �������� socket.io server

io.on("connection", (socket) => {
  // socket = client from connection
  
    socket.on("sendMessage", (data) => {
        const text = data.data;
        const id = data.socket_id
        console.log(id)
        io.sockets.emit("newMessage", {text: `${text}`,id: id });
  });
});
