const stats = document.getElementById("stats");
const notes_conteiner = document.getElementById("content");

let notes = [];

async function loadNotes() {
  try {
    const res = await fetch("api/notes");
    notes = await res.json();
    if(notes.length === 0){
      stats.innerText = "У вас нет заметок. Создайте свою первую заметку! \n\n";
    }
    else{
      stats.innerText = `Заметок ${notes.length}`;
    }
  } catch (error) {
    console.log("Ощибка", error);
    stats.innerText = `Информации о заметках нет`;
  }
}

async function addNote() {
  const title = prompt("Введите название ");
  const content = prompt("Введите содержание ");
  if(title === null | content === null){
    alert("Заметка не может содержать пустое название или содержание!");
    return;
  }
  try {
    await fetch("api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    await showNotes();
  } catch (error) {
    console.log("ERROR", error.message);
  }
}

async function showNotes(){
    await loadNotes();
    if(notes.length === 0){
       notes_conteiner.innerHTML = '<h2> Пока у вас нет заметок! </h2>';
    }
    let html = '<h2> --- Заметки --- </h2>';
    notes.forEach((note) => {
        html += `
          <div style=" background-color: #030202; color: #008f4a; ">
              <small> [ ${note.id} ] ${note.date} </small>
              <strong> ${note.title} </strong>
              <p> ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ </p>
              <strong> ${note.content} </strong>
          </div>
        `;
    });
    notes_conteiner.innerHTML = html;
    
}

async function resetNote() {
  await loadNotes();
  if (notes.length === 0) { alert("Пока нечего изменять! Заметок нет!"); return; }

  let list = notes.map(note => ` [${note.id}] ${note.title} `).join('\n');
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
      headers: { 'Content-Type': 'application/json' },
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


async function deleteNote(){
  await loadNotes();
  if(notes.length === 0){
       alert("Пока нечего удалить! Заметок нет!");
  }
  let list = notes.map(note => ` [${note.id}] ${note.title} `).join('\n');
  const input = prompt(`Введите номер заметки для удаления: \n\n${list}`);

  const id_input = parseInt(input);
  if(!input){return;}

  if(id_input > 0 && id_input <= notes.length){
    const res = await fetch(`api/notes/${id_input}`, {method: 'DELETE'});
    if(res.ok){
        await showNotes()
    }
  }
  else{
    alert("Отмена удаления! \nНомер укажи!");
  }
}

loadNotes();