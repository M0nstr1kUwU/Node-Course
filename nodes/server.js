const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");

let notes = fileManager.loadFile();

const server = http.createServer(async (requestAnimationFrame, res) => {
    const {url, method} = req

    // Root Routers

    if(url === '/' && method === 'GET'){
        const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }

    if(url === '/app.js' && method === 'GET'){
        const js = await fs.readFile(path.join(__dirname, 'app.js'), 'utf-8');
        res.writeHead(200, {'Content-Type': 'application/javascript'})
        res.end(js);
    }

    // Api Routers

    if(url === 'api/notes' && method === 'GET'){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(notes))
    }
});

server.listen(3000, () => {
    console.log("Сервер запущен на порту http://localhhost:3000")
});