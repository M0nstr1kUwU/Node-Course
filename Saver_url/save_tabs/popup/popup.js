const saveTabsDiv = document.getElementById("save-tabs");
const saverBtn = document.getElementById("saver");
let savedTabs = [];

function loadTabs() {
    chrome.storage.local.get(["savedTabs"], (result) => {
        if (result.savedTabs) {
            savedTabs = result.savedTabs;
        } else {
            savedTabs = [];
        }
        showTabs();
    });
}

function showTabs() {
    if (savedTabs.length === 0) {
        saveTabsDiv.innerHTML = "<p>Нет сохранённых вкладок</p>";
        return;
    }

    let html = "";
    for (let i = 0; i < savedTabs.length; i++) {
        html += `
            <div class="cont">
                <h3>${savedTabs[i].title}</h3>
                <button class="open-btn" data-url="${savedTabs[i].url}">Открыть</button>
                <button class="delete-btn" data-index="${i}">Удалить</button>
            </div>
        `;
    }
    saveTabsDiv.innerHTML = html;

    document.querySelectorAll(".open-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const url = btn.getAttribute("data-url");
            chrome.tabs.create({ url: url });
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(btn.getAttribute("data-index"));
            savedTabs.splice(index, 1);
            chrome.storage.local.set({ savedTabs: savedTabs });
            showTabs();
        });
    });
}

saverBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        const newTab = {
            url: activeTab.url,
            title: activeTab.title
        };
        savedTabs.push(newTab);
        chrome.storage.local.set({ savedTabs: savedTabs });
        showTabs();
    });
});

loadTabs();