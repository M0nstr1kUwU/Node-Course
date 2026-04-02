import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'users.json');

export const loadUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Ошибка загрузки users.json:', error.message);
        return [];
    }
};

export const saveUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.log('Ошибка сохранения users.json:', error.message);
    }
};

export const registerUser = (username, password) => {
    const users = loadUsers();
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Пользователь уже существует' };
    }
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
        id: newId,
        username: username,
        password: password
    };
    users.push(newUser);
    saveUsers(users);
    return { success: true, userId: newUser.id, username: username };
};

export const loginUser = (username, password) => {
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return { success: true, userId: user.id, username: user.username };
    } else {
        return { success: false, message: 'Неверное имя пользователя или пароль' };
    }
};