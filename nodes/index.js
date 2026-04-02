const readline = require("readline");
const helper = require("./utils/helper");
const Decorator = require("./utils/decorator");
const fileManager = require("./utils/fileManager");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const NAME_PROJ = '"NOTE"-"BOOK"';
let notes = fileManager.loadFile();
let welcome = `Тебя приветствует приложение ${NAME_PROJ}`;

const question = async (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};


const welcomeApp = async () => {
  Decorator.presentWelcome(welcome);
  await showMenu();
};

const addNote = async () => {
  const title = await question("Введите заголовок  ");
  const content = await question("Напишите текст заметки  ");

  const newNote = {
    id: notes.length + 1,
    title: title,
    content: content,
    date: new Date().toLocaleString(),
  };
  notes.push(newNote);
  fileManager.saveFile(notes);
  console.log(`Заметка ${newNote.title} сохранена!`);

  await showMenu();
};

const editNote = async () => {
  if (notes.length === 0) {
    console.log("У вас пока нет заметок!");
    await showMenu();
    return;
  }

  console.log("\nСписок заметок:");
  notes.forEach((note) => {
    console.log(` * [${note.id}] * ${note.title} *`);
  });

  const idInput = await question("\nВведите номер заметки для редактирования (или 0 для отмены): ");
  const id = parseInt(idInput);
  if (id === 0) {
    await showMenu();
    return;
  }

  const noteToEdit = notes.find(n => n.id === id);
  if (!noteToEdit) {
    console.log("Нет заметки с таким номером!");
    await showMenu();
    return;
  }

  const newTitle = await question(`Введите новый заголовок (текущий: ${noteToEdit.title}): `);
  const newContent = await question(`Введите новое содержание (текущее: ${noteToEdit.content}): `);

  noteToEdit.title = newTitle || noteToEdit.title;
  noteToEdit.content = newContent || noteToEdit.content;
  noteToEdit.date = new Date().toLocaleString();

  fileManager.saveFile(notes);
  console.log("Заметка обновлена!");
  await showMenu();
};

const showNotes = async () => {
  Decorator.showFormatAllNotes(notes);
  await showMenu();
};

const showMenu = async () => {
  helper.statsNotes(notes);
  Decorator.presentMenu();

  const choice = await question("Выберите пункт от 1 до 5  ");
  try {
    switch (choice) {
      case "1":
        await addNote();
        break;
      case "2":
        await showNotes();
        break;
      case "3":
        await deleteNote();
        break;
      case "4":
        await editNote();
        break;
      case "5":
        console.log("Завершение работы!");
        rl.close();
        break;
      default:
        console.log("Нет такого пункта!");
        await showMenu();
    }
  } catch (e) {
    console.log("Ошибка! Закрытие приложения!");
    rl.close();
  }
};

const deleteNote = async () => {
  if (notes.length === 0) {
    console.log("У вас пока нет заметок!");
  }
  notes.forEach((note) => {
    console.log(`\n * [${note.id}] * ${note.title} *`);
  });

  const choice = await question(
    "Введите номер заметки для удаления или 0 для отмены  ",
  );

  let num = parseInt(choice);

  if (num === 0) {
    await showMenu();
  } else if (num > 0 && num <= notes.length) {
    notes.splice(num - 1, 1);
    notes = helper.reindexId(notes);
    fileManager.saveFile(notes);
    console.log(`Заметка удалена!`);
  } else {
    console.log("Нет подходящей заметки!");
    await showMenu();
  }

  await showMenu();
};

welcomeApp();