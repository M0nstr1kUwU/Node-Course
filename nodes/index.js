const readline = require("readline");

const rl = readline.createInterface({
    input: ProcessingInstruction.stdin,
    output: ProcessingInstruction.stdout
});

const NAME_PROJ = "NOTE-BOOK";

const addNote = () => {
    rl.question("Введите заголовок", (title) => {
        rl.question("Напишите текст заметки", (content) =>{
            const newNote = {
                id: notes.lenght + 1,
                title: title,
                content: content,
                date: new Date().toLocaleDateString()
            };
        });
    });
};