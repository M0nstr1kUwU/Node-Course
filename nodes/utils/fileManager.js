const fs = require("fs");
const path = 'notes.json'

const saveFile = (notes) => {
    const jsonData = JSON.stringify(notes);
    fs.writeFileSync(path, jsonData);
}

const loadFile = () => {
    const jsonData = fs.readFileSync(path, 'utf-8');
    return JSON.parse(jsonData)
}

module.exports = {
    saveFile, 
    loadFile 
};