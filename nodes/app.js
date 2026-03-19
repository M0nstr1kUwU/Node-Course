const stats = document.getElementById('stats');
const content = document.getElementById('content');

let notes = []

async function loadNotes(){
    try{
        const res = await fetch('/api/notes');
        notes = await res.json();
        stats.innerText = `Заметок ${notes.length}`;
    }
    catch(error){
        console.log("Ошибка", error);
        stats.innerHTML = `Информации о заметках нет`;
    }
}


async function addNote(){
    const title = prompt("Введите название ");
    const content = prompt("Введите содержание ");
    
    try{
        await fetch('/api/notes', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, content})
        });
    }
    catch(error){
        console.log("Ошибка", error);
    }
}

loadNotes();