const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");

let notes = fileManager.loadFile();

const server = http.createServer(async (requestAnimationFrame, res) => {
    const {url, method} = req
});

server.listen(3000, () => {
    console.log("Сервер запущен на порту http://localhhost:3000")
});