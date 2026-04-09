export function registerFunctions(register) {
  // 🔹 Отключить JS (перезагрузка без кэша)
  register({
    name: "⚡ Отключить JS",
    render: (container) => {
      const btn = document.createElement("button");
      btn.textContent = "Стоп JS";
      btn.onclick = () => location.reload(true);
      container.appendChild(btn);
    }
  });

  // 🔹 Показать localStorage сайта
  register({
    name: "📦 localStorage сайта",
    render: (container, getTabId) => {
      const btn = document.createElement("button");
      btn.textContent = "Показать storage";
      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => ({ ...localStorage })
        }, (res) => alert(JSON.stringify(res[0].result, null, 2)));
      });
      container.appendChild(btn);
    }
  });
}