const readline = require("readline"); // импортируем модуль из node

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const NAME_PROJ = '"NOTE"-"BOOK"';

let notes = [];

let welcome = `Тебя приветствует приложение ${NAME_PROJ}`;

const addNote = () => {
  rl.question("Введите заголовок", (title) => {
    rl.question("Напишите текст заметки", (content) => {
      const newNote = {
        id: notes.length + 1,
        title: title,
        content: content,
        date: new Date().toLocaleString()
      };
      notes.push(newNote);
      console.log(`Заметка ${newNote.title} сохранена!`);
      console.log(`Всего заметок ${notes.length}`);

      showMenu();
    });
  });
};

const deleteNote = () => {
  rl.question("Введите номер заметки для её удаления или 0 для отмены", (choice) => {});
  let num = parseInt(choice);
  notes.forEach((note) => {
    console.log(`\n * [${note.id}] * [${note.title}] *`)
  });
  if(num === 0){
    showMenu();
  }
  else if(num > 0 && num <= notes.length){
    notes.splice(num - 1, 1);
    console.log(`Заметка удалена!`);
  }
  else{
    console.log("Нет подходящих заметок!")
  }
}

const showNotes = () => {
  consol.log("----Все ваши заметки----");
  notes.forEach((note) => {
    console.log("-".repeat(30));
    console.log(`${note.id} * ${note.date}`);
    console.log(`${note.title}`);
    console.log(`${note.content}`);
    console.log("-".repeat(30));
  });
  showMenu();
};

const showMenu = () => {
  console.log(`${welcome}`);
  console.log(`Всего заметок ${notes.length}`);
  console.log("Главное меню");
  console.log("1. Доюавить заметку");
  console.log("2. Посмотреть заметки");
  console.log("3. Удалить заметку")

  rl.question("Выберите пункт от 1 до 3", (choice) => {
    switch(choice){
      case '1':
        addNote();
        break;
      case '2':
        deleteNote();
        break;
      case '3':
        showNotes();
        break;
      default:
        console.log("Нет такого пункта!");
        showMenu();
    };
  });
};

showMenu();
