const stats = document.getElementById("stats");
const notesContainer = document.getElementById("content");
let notes = [];

const userId = localStorage.getItem('userId');
if (!userId) {
    window.location.href = '/login.html';
}

const username = localStorage.getItem('username');
if (username) {
    const userInfoDiv = document.getElementById('user-info');
    if (userInfoDiv) {
        userInfoDiv.innerHTML = `LK: ${username}  <button onclick="logout()">Выйти</button>`;
    }
}

async function loadNotes() {
    try {
        const res = await fetch("api/notes", {
            headers: { 'userid': userId }
        });
        if (res.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        notes = await res.json();
        if (notes.length === 0) {
            stats.innerText = "У вас нет заметок. Создайте свою первую заметку!\n\n";
        } else {
            stats.innerText = `Заметок ${notes.length}`;
        }
    } catch (error) {
        console.log("Ошибка загрузки заметок", error);
        stats.innerText = `Информации о заметках нет`;
    }
}

async function addNote() {
    const title = prompt("Введите название заметки");
    const content = prompt("Введите содержание заметки");
    if (!title || !content) {
        alert("Заметка не может содержать пустое название или содержание!");
        return;
    }
    try {
        await fetch("api/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'userid': userId
            },
            body: JSON.stringify({ title, content }),
        });
        await showNotes();
    } catch (error) {
        console.log("ERROR", error.message);
    }
}

async function showNotes() {
    await loadNotes();
    if (notes.length === 0) {
        notesContainer.innerHTML = '<h2>Пока у вас нет заметок!</h2>';
        return;
    }
    let html = '<h2>--- ЗАМЕТКИ ---</h2>';
    notes.forEach((note) => {
        html += `
            <div style="background-color: #030202; color: #008f4a; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                <small>[${note.id}] ${note.date}</small>
                <strong>${note.title}</strong>
                <p>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</p>
                <strong>${note.content}</strong>
            </div>
        `;
    });
    notesContainer.innerHTML = html;
}

async function resetNote() {
    await loadNotes();
    if (notes.length === 0) {
        alert("Пока нечего изменять! Заметок нет!");
        return;
    }
    let list = notes.map(note => `[${note.id}] ${note.title}`).join('\n');
    const input = prompt(`Введите номер заметки для изменения:\n\n${list}`);
    if (!input) return;
    const id_input = parseInt(input);
    if (id_input > 0 && id_input <= notes.length) {
        const currentNote = notes.find(n => n.id === id_input);
        const newTitle = prompt("Введите новый заголовок:", currentNote.title);
        const newContent = prompt("Введите новое содержание:", currentNote.content);
        const updatedNote = {
            title: newTitle || currentNote.title,
            content: newContent || currentNote.content
        };
        const res = await fetch(`api/notes/${id_input}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'userid': userId
            },
            body: JSON.stringify(updatedNote)
        });
        if (res.ok) {
            await showNotes();
        } else {
            alert("Ошибка при изменении заметки");
        }
    } else {
        alert("Некорректный номер заметки!");
    }
}

async function deleteNote() {
    await loadNotes();
    if (notes.length === 0) {
        alert("Пока нечего удалить! Заметок нет!");
        return;
    }
    let list = notes.map(note => `[${note.id}] ${note.title}`).join('\n');
    const input = prompt(`Введите номер заметки для удаления:\n\n${list}`);
    if (!input) return;
    const id_input = parseInt(input);
    if (id_input > 0 && id_input <= notes.length) {
        const res = await fetch(`api/notes/${id_input}`, {
            method: 'DELETE',
            headers: { 'userid': userId }
        });
        if (res.ok) {
            await showNotes();
        } else {
            alert("Не удалось удалить заметку");
        }
    } else {
        alert("Отмена удаления! Укажите корректный номер.");
    }
}

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}


loadNotes();

window.showNotes = showNotes;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.resetNote = resetNote;
window.logout = logout;