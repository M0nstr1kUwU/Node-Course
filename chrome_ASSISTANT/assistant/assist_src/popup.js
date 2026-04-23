// Импорт registry динамически через chrome.runtime.getURL (надёжнее)
const FUNCTIONS_CONTAINER = document.getElementById("functions-container");
const TOP_ACTIONS = document.getElementById("top-actions");

const DEFAULT_SETTINGS = { theme: "dark", accent: "#ff8800" };

function getSettings() {
  try {
    const raw = localStorage.getItem("settings");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 255) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 255) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 255) + Math.round(255 * percent / 100));
  return `rgb(${r}, ${g}, ${b})`;
}

function applyTheme() {
  const settings = getSettings();
  document.body.classList.toggle("light", settings.theme === "light");
  document.documentElement.style.setProperty("--accent", settings.accent);
  document.documentElement.style.setProperty("--accent-hover", lightenColor(settings.accent, 12));
}

// Получение активной вкладки с проверкой
function getSafeTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab || !tab.id || !tab.url) {
      alert("Нет активной вкладки");
      return;
    }
    const restricted = ["chrome://", "edge://", "about:", "chrome-extension://"];
    if (restricted.some(prefix => tab.url.startsWith(prefix))) {
      alert("Откройте обычный сайт (HTTP/HTTPS)");
      return;
    }
    callback(tab.id);
  });
}

function addTopButton(text, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.onclick = onClick;
  TOP_ACTIONS.appendChild(btn);
  return btn;
}

function createCard(title) {
  const card = document.createElement("div");
  card.className = "card";
  const h3 = document.createElement("h3");
  h3.textContent = title;
  card.appendChild(h3);
  return card;
}

function registerFunction(def) {
  const card = createCard(def.name || "Функция");
  const inner = document.createElement("div");
  card.appendChild(inner);
  try {
    def.render(inner, getSafeTab);
  } catch (e) {
    inner.innerHTML = `<div class="small-note">Ошибка: ${e.message}</div>`;
    console.error(def.name, e);
  }
  FUNCTIONS_CONTAINER.appendChild(card);
}

// Статические кнопки (панель, плеер, настройки)
function renderStaticButtons() {
  addTopButton("🚀 Панель", () => {
    getSafeTab((tabId) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          if (document.getElementById("my-overlay")) {
            document.getElementById("my-overlay").remove();
            return;
          }
          const panel = document.createElement("div");
          panel.id = "my-overlay";
          panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 360px; min-height: 220px;
            z-index: 999999; border-radius: 18px; padding: 14px;
            background: rgba(20,24,35,0.96); color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,.45);
            backdrop-filter: blur(12px); resize: both; overflow: auto;
          `;
          panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
              <strong>Assistant</strong>
              <button id="close-overlay">✕</button>
            </div>
            <div>Панель быстрых действий (можно расширить)</div>
          `;
          document.body.appendChild(panel);
          panel.querySelector("#close-overlay").onclick = () => panel.remove();
          // drag logic ...
        }
      });
    });
  });

  addTopButton("📺 Мини-плеер", () => {
    getSafeTab((tabId) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
          // существующий код мини-плеера (оставляем как есть)
          const existing = document.getElementById("assistant-mini-player");
          if (existing) { existing.remove(); if(document.pictureInPictureElement) await document.exitPictureInPicture(); return; }
          const video = document.querySelector("video");
          if (!video) { alert("Видео не найдено"); return; }
          if (video.requestPictureInPicture) {
            try { await video.play(); await video.requestPictureInPicture(); return; } catch(e) {}
          }
          // fallback с плавающим окном
          // ... (можно взять из вашего кода)
        }
      });
    });
  });

  addTopButton("⚙️ Настройки", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("assist_src/settings.html") });
  });
}

// Загрузка всех модулей из registry
async function loadModules() {
  try {
    const registryUrl = chrome.runtime.getURL("assist_src/func_src/registry.js");
    const registryModule = await import(registryUrl);
    const modules = registryModule.default || [];
    for (const modFile of modules) {
      try {
        const modUrl = chrome.runtime.getURL(`assist_src/func_src/${modFile}`);
        const mod = await import(modUrl);
        if (typeof mod.registerFunctions === "function") {
          mod.registerFunctions(registerFunction);
        } else {
          console.warn(`Модуль ${modFile} не экспортирует registerFunctions`);
        }
      } catch (err) {
        console.warn(`Ошибка загрузки ${modFile}`, err);
      }
    }
  } catch (err) {
    console.warn("registry.js не загружен", err);
  }
}

// Инициализация
applyTheme();
renderStaticButtons();
loadModules();