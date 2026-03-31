const quotes = [];

function saveQuotes(){
    localStorage.setItem('quotes', quotes);
}

function loadQuotes(){
    const saved = localStorage.getItem('quotes');
    if(saved){
        quotes = JSON.parse(saved);
    }
}

function renderQuotes(){
    let list = document.getElementById("quotesList");
    let html = "";

    quotes.forEach((quote, index) => {
        html += `
            <div class=""> ${quote.textInput}</div>
            <div class=""> ${quote.authorInput}</div>
            <button class="delete-btn" data-index="${index}"> Удалить </button>
        `;
    });
    list.innerHTML = html;

    document.querySelectorAll("delete-btn").forEach(btn => { btn.addEventListener('click', deleteQuote); });
}

function addQuote(){
    const text = document.getElementById('quoteText');
    const author = document.getElementById('quoteAuthor');

    const textInput = text.value;
    const authorInput = text.value;

    console.log(textInput);
    console.log(authorInput);

    quotes.push({textInput, authorInput})
}

function deleteQuote(){

}

document.getElementById('addBtn').addEventListener('click', addQuote);


loadQuotes();