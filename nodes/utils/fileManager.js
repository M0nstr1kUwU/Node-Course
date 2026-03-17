const fs = require("fs");
const path = 'notes.json'

const saveFile = (notes) => {
    const jsonData = JSON.stringify(notes);
    fs.writeFileSync(path, jsonData);
}

const loadFile = () => {
    return fs.readFileSync(path, 'utf-8');
}

module.exports = {
    saveFile, 
    loadFile 
};