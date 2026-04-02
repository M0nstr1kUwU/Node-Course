import * as http from 'http';
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import * as fileManager from './utils/fileManager.mjs';
import * as userManager from './utils/userManager.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
    const { url, method } = req;

    if (url === '/' && method === 'GET') {
        const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    if (url === '/app.js' && method === 'GET') {
        const js = await fs.readFile(path.join(__dirname, 'app.js'), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(js);
        return;
    }

    if (url === '/login.html' && method === 'GET') {
        const html = await fs.readFile(path.join(__dirname, 'login.html'), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    // --- API ROOT
    if (url === '/api/register' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const result = userManager.registerUser(username, password);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Неверный формат запроса' }));
            }
        });
        return;
    }

    if (url === '/api/login' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                const result = userManager.loginUser(username, password);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Неверный формат запроса' }));
            }
        });
        return;
    }

    // --- API CLIENT
    const userIdHeader = req.headers.userid;
    const userId = userIdHeader ? parseInt(userIdHeader) : null;

    const isUnauthorized = () => {
        if (!userId) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Не авторизован' }));
            return true;
        }
        return false;
    };

    if (url === '/api/notes' && method === 'GET') {
        if (isUnauthorized()) return;
        const userNotes = fileManager.getUserNotes(userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userNotes));
        return;
    }

    if (url === '/api/notes' && method === 'POST') {
        if (isUnauthorized()) return;
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { title, content } = JSON.parse(body);
                if (!title || !content) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Название и содержание обязательны' }));
                    return;
                }
                const newNote = fileManager.createNote(userId, title, content);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, note: newNote }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Ошибка формата данных' }));
            }
        });
        return;
    }

    if (url.startsWith('/api/notes/') && method === 'PUT') {
        if (isUnauthorized()) return;
        const noteId = parseInt(url.split('/')[3]);
        if (isNaN(noteId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Неверный ID заметки' }));
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { title, content } = JSON.parse(body);
                const updated = fileManager.updateNote(userId, noteId, title, content);
                if (updated) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Заметка не найдена' }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Ошибка формата данных' }));
            }
        });
        return;
    }

    if (url.startsWith('/api/notes/') && method === 'DELETE') {
        if (isUnauthorized()) return;
        const noteId = parseInt(url.split('/')[3]);
        if (isNaN(noteId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Неверный ID заметки' }));
            return;
        }
        const deleted = fileManager.deleteNote(userId, noteId);
        if (deleted) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Заметка не найдена' }));
        }
        return;
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});