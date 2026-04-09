export function registerFunctions(register) {
  // 🔹 CSS инспектор
  register({
    name: "🎨 CSS Inspector",
    render: (container, getTabId) => {
      const btn = document.createElement("button");
      btn.textContent = "Включить инспектор";
      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => { document.onmouseover = e => e.target.style.outline = "2px solid red"; }
        });
      });
      container.appendChild(btn);
    }
  });

  // 🔹 Поиск текста
  register({
    name: "🔍 Поиск текста",
    render: (container, getTabId) => {
      const input = document.createElement("input");
      input.placeholder = "Введите текст";
      input.style.width = "100%";
      input.style.padding = "4px";
      input.style.marginBottom = "4px";

      const btn = document.createElement("button");
      btn.textContent = "Найти";

      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (text) => {
            document.body.innerHTML = document.body.innerHTML.replaceAll(text, `<mark>${text}</mark>`);
          },
          args: [input.value]
        });
      });

      container.append(input, btn);
    }
  });

  // 🔹 Скопировать все ссылки
  register({
    name: "🧾 Все ссылки",
    render: (container, getTabId) => {
      const btn = document.createElement("button");
      btn.textContent = "Скопировать ссылки";
      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => Array.from(document.querySelectorAll("a")).map(a => a.href)
        }, (res) => navigator.clipboard.writeText(res[0].result.join("\n")));
      });
      container.appendChild(btn);
    }
  });
}