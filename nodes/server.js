const http = require("http");
const fs = require("fs").promises;
const path = require("path");

const helper = require("./utils/helper");
const fileManager = require("./utils/fileManager");

let notes = fileManager.loadFile();

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  // ROOT ROUTERS

  if (url === "/" && method === "GET") {
    const html = await fs.readFile(path.join(__dirname, "index.html"), "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (url === "/app.js" && method === "GET") {
    const js = await fs.readFile(path.join(__dirname, "app.js"), "utf-8");
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(js);
    return;
  }

  // API ROUTERS

  if (url === "/api/notes" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }

  if (url === "/api/notes" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { title, content } = JSON.parse(body);
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString(),
      };
      notes.push(newNote);
      fileManager.saveFile(notes);
      console.log(`Заметка ${newNote.title} сохранена!`);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
      return;
    });
    return;
  }

  if(url.startsWith("/api/notes/") && method === 'DELETE'){
      const id = parseInt(url.split('/')[3]);
      notes.splice(id - 1, 1);
      notes = helper.reindexId(notes);
      fileManager.saveFile(notes);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
      return;
  }

  if (url.startsWith("/api/notes/") && method === "PUT") {
    const id = parseInt(url.split('/')[3]);
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { title, content } = JSON.parse(body);
      const noteIndex = notes.findIndex(n => n.id === id);
      if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].date = new Date().toLocaleString();
        fileManager.saveFile(notes);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Note not found" }));
      }
    });
    return;
  }
});

server.listen(3000, () => {
  console.log("Сервер запущен на порту http://localhost:3000");
});