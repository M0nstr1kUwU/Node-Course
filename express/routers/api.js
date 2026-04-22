import express from "express";

let login = "test"
let password = "test";



const router = express.Router();

router.post("/login", (req, res) => {
    if (!login || !password && (!password && !login)) {
        return res.status(401).send({ status: "error" });
    }
    if (login === "test" || password === "test") {
        return res.status(200).send({ status: "success" });
    }
    else{
        res.status(401).send({ status: "error" });    
    }
})