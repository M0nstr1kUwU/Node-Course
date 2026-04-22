import express from "express";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    
    
const router = express.Router();



router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).send({status: "Username and password are required"});
    }
    else{
        return res.status(200).send({status: "Success"});
    }
})
