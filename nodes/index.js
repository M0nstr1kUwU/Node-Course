const readline = require("readline");
const helper = require("./utils/helper");
const Decorator = require("./utils/decorator");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const NAME_PROJ = '"NOTE"-"BOOK"';

let notes = [];

let welcome = `Тебя приветствует приложение ${NAME_PROJ}`;

const welcomeApp = () => {
  Decorator.presentMenu(welcome);
  showMenu();
};

const addNote = () => {
  rl.question("Введите заголовок: ", (title) => {
    // Валидация заголовка
    const titleValidation = helper.validateInput(title);
    if (!titleValidation.isValid) {
      Decorator.infoMessage(titleValidation.message, 'error');
      return addNote();
    }

    rl.question("Напишите текст заметки: ", (content) => {
      // Валидация контента
      const contentValidation = helper.validateInput(content);
      if (!contentValidation.isValid) {
        Decorator.infoMessage(contentValidation.message, 'error');
        return addNote();
      }

      const newNote = {
        id: notes.length + 1,
        title: titleValidation.value,
        content: contentValidation.value,
        date: helper.formatDate(new Date())
      };
      
      notes.push(newNote);
      Decorator.infoMessage(`Заметка "${newNote.title}" сохранена!`, 'success');
      Decorator.infoMessage(`Всего заметок: ${notes.length}`, 'info');

      showMenu();
    });
  });
}; 

const showNotes = () => {
  if (notes.length === 0) {
    Decorator.infoMessage('У вас пока нет заметок!', 'warning');
    return showMenu();
  }

  Decorator.drawDoubleLine();
  console.log('         ВСЕ ВАШИ ЗАМЕТКИ');
  Decorator.drawDoubleLine();
  
  notes.forEach((note) => {
    Decorator.noteHeader(note);
    console.log(`   ID: ${note.id}`);
    console.log(`   Дата: ${note.date}`);
    Decorator.contentBox(note.content);
    console.log('\n');
  });
  
  showMenu();
};

const showMenu = () => {
  Decorator.infoMessage(`Всего заметок: ${notes.length}`, 'info');
  
  const menuItems = [
    'Добавить заметку',
    'Посмотреть заметки', 
    'Удалить заметку'
  ];
  
  Decorator.showMenu(menuItems);

  rl.question("Выберите пункт от 1 до 4: ", (choice) => {
    const validation = helper.validateInput(choice, 'number');
    
    if (!validation.isValid) {
      Decorator.infoMessage(validation.message, 'error');
      return showMenu();
    }

    switch(validation.value) {
      case 1:
        addNote();
        break;
      case 2:
        showNotes();
        break;
      case 3:
        deleteNote();
        break;
      default:
        Decorator.infoMessage("Нет такого пункта!", 'error');
        showMenu();
    }
  });
};

const deleteNote = () => {
  if (notes.length === 0) {
    Decorator.infoMessage("У вас пока нет заметок!", 'warning');
    return showMenu();
  }

  Decorator.drawLine();
  console.log('   ВЫБЕРИТЕ ЗАМЕТКУ ДЛЯ УДАЛЕНИЯ:');
  Decorator.drawLine();
  
  notes.forEach((note) => {
    console.log(`   [${note.id}] * ${note.title}`);
  });
  
  rl.question("\nВведите номер заметки (0 для отмены): ", (choice) => {
    const validation = helper.validateInput(choice, 'number');
    
    if (!validation.isValid) {
      Decorator.infoMessage(validation.message, 'error');
      return showMenu();
    }

    let num = validation.value;
    
    if (num === 0) {
      showMenu();
    }
    else if (num > 0 && num <= notes.length) {
      notes.splice(num - 1, 1);
      notes = helper.reindexId(notes);
      Decorator.infoMessage(`Заметка удалена!`, 'success');
      showMenu();
    }
    else {
      Decorator.infoMessage("Нет подходящей заметки!", 'error');
      showMenu();
    }
  });
};

welcomeApp();