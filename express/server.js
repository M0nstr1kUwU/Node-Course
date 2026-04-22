import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import apiRouters from "routers/api";
import pagesRouters from "routers/pages";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirName(__filename);

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencode({extended: true}));
app.use(express.json());

app.use("/api", apiRouters);
app.use("/", pagesRouters);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
})

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "404.html"));
})

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).send({status: "Username and password are required"});
    }
    else{
        return res.status(200).send({status: "Success"});    
    }
})

app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})