import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTES_FILE = path.join(__dirname, 'notes.json');

export const loadFile = () => {
    try {
        const data = fs.readFileSync(NOTES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Ошибка загрузки notes.json:', error.message);
        return [];
    }
};

export const saveFile = (notes) => {
    try {
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    } catch (error) {
        console.log('Ошибка сохранения notes.json:', error.message);
    }
};

export const getUserNotes = (userId) => {
    const allNotes = loadFile();
    return allNotes.filter(note => note.owner_id === userId);
};

export const createNote = (userId, title, content) => {
    const allNotes = loadFile();
    const userNotes = allNotes.filter(n => n.owner_id === userId);
    const nextId = userNotes.length > 0 ? Math.max(...userNotes.map(n => n.id)) + 1 : 1;
    const newNote = {
        id: nextId,
        owner_id: userId,
        title: title,
        content: content,
        date: new Date().toLocaleString()
    };
    allNotes.push(newNote);
    saveFile(allNotes);
    return newNote;
};

export const updateNote = (userId, noteId, title, content) => {
    const allNotes = loadFile();
    const noteIndex = allNotes.findIndex(n => n.id === noteId && n.owner_id === userId);
    if (noteIndex === -1) return false;
    allNotes[noteIndex].title = title;
    allNotes[noteIndex].content = content;
    allNotes[noteIndex].date = new Date().toLocaleString();
    saveFile(allNotes);
    return true;
};

export const deleteNote = (userId, noteId) => {
    let allNotes = loadFile();

    const newAllNotes = allNotes.filter(n => !(n.id === noteId && n.owner_id === userId));
    if (newAllNotes.length === allNotes.length) return false;

    const userNotes = newAllNotes.filter(n => n.owner_id === userId);
    let newId = 1;
    for (const note of userNotes) {
        note.id = newId++;
    }
    const otherNotes = newAllNotes.filter(n => n.owner_id !== userId);
    const finalNotes = [...userNotes, ...otherNotes];
    saveFile(finalNotes);
    return true;
};