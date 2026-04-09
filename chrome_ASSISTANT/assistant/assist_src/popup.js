import modules from "./func_src/registry.js";

const TOP_ACTIONS = document.getElementById("top-actions");
const FUNCTIONS_CONTAINER = document.getElementById("functions-container");

modules.forEach(async modFile => {
  try {
    const mod = await import(`./func_src/${modFile}`);
    if (mod.registerFunctions) {
      mod.registerFunctions(registerFunction);
    }
  } catch(e) {
    console.error("Ошибка модуля:", modFile, e);
  }
});

const DEFAULT_SETTINGS = {
  theme: "dark",
  accent: "#ff8800"
};

function getSettings() {
  try {
    const raw = localStorage.getItem("settings");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function applyTheme() {
  const settings = getSettings();
  document.body.classList.toggle("light", settings.theme === "light");
  document.documentElement.style.setProperty("--accent", settings.accent);

  const accent = settings.accent || "#ff8800";
  document.documentElement.style.setProperty("--accent-hover", brighten(accent, 12));
}

function brighten(hex, percent) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.min(255, ((num >> 16) & 255) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 255) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 255) + Math.round(255 * percent / 100));
  return `rgb(${r}, ${g}, ${b})`;
}

function getSafeTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab || !tab.id || !tab.url) {
      alert("Нет активной вкладки");
      return;
    }

    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("edge://") ||
      tab.url.startsWith("about:") ||
      tab.url.startsWith("chrome-extension://")
    ) {
      alert("Открой обычный сайт");
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
    const err = document.createElement("div");
    err.className = "small-note";
    err.textContent = "Ошибка рендера модуля";
    inner.appendChild(err);
    console.error(def.name, e);
  }

  FUNCTIONS_CONTAINER.appendChild(card);
}

function renderStaticButtons() {
  addTopButton("🚀 Панель", () => {
    getSafeTab((tabId) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const old = document.getElementById("my-overlay");
          if (old) {
            old.remove();
            return;
          }

          const panel = document.createElement("div");
          panel.id = "my-overlay";
          panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            min-height: 220px;
            z-index: 999999;
            border-radius: 18px;
            padding: 14px;
            background: rgba(20, 24, 35, 0.96);
            color: #fff;
            box-shadow: 0 20px 50px rgba(0,0,0,.45);
            backdrop-filter: blur(12px);
            resize: both;
            overflow: auto;
          `;

          panel.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
              <div style="font-weight:700;font-size:16px;">Assistant</div>
              <button id="close-overlay" style="padding:8px 10px;">✕</button>
            </div>
            <div style="opacity:.8;font-size:13px;line-height:1.5;">
              Панель открыта. Здесь позже можно встроить любые быстрые действия.
            </div>
          `;

          document.body.appendChild(panel);
          panel.querySelector("#close-overlay").onclick = () => panel.remove();

          let down = false;
          let ox = 0;
          let oy = 0;

          panel.onmousedown = (e) => {
            if (e.target.tagName === "BUTTON") return;
            down = true;
            ox = e.offsetX;
            oy = e.offsetY;
            panel.style.cursor = "grabbing";
          };

          document.onmouseup = () => {
            down = false;
            panel.style.cursor = "default";
          };

          document.onmousemove = (e) => {
            if (!down) return;
            panel.style.left = `${e.pageX - ox}px`;
            panel.style.top = `${e.pageY - oy}px`;
          };
        }
      });
    });
  });

  addTopButton("📺 Мини-плеер", () => {
    getSafeTab((tabId) => {
      chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
          const existing = document.getElementById("assistant-mini-player");
          if (existing) {
            existing.remove();
            if (document.pictureInPictureElement) {
              await document.exitPictureInPicture().catch(() => {});
            }
            return;
          }

          const video = document.querySelector("video");
          if (!video) {
            alert("Видео не найдено");
            return;
          }

          if (video.requestPictureInPicture) {
            try {
              await video.play().catch(() => {});
              await video.requestPictureInPicture();
              return;
            } catch (e) {
              console.warn("PiP не сработал, использую fallback", e);
            }
          }

          const box = document.createElement("div");
          box.id = "assistant-mini-player";
          box.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 340px;
            z-index: 999999;
            border-radius: 16px;
            overflow: hidden;
            background: #000;
            box-shadow: 0 20px 50px rgba(0,0,0,.5);
            resize: both;
          `;

          const toolbar = document.createElement("div");
          toolbar.style.cssText = `
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            padding:8px;
            background: rgba(255,255,255,0.08);
            color:#fff;
            cursor: move;
          `;

          const title = document.createElement("div");
          title.textContent = "Мини-плеер";
          title.style.fontWeight = "700";

          const close = document.createElement("button");
          close.textContent = "✕";
          close.style.padding = "8px 10px";

          const player = document.createElement("video");
          player.controls = true;
          player.autoplay = true;
          player.playsInline = true;
          player.muted = video.muted;
          player.style.cssText = "display:block;width:100%;height:auto;background:#000;";

          const src = video.currentSrc || video.src;
          if (src) {
            player.src = src;
          } else if (video.querySelector("source")) {
            const s = video.querySelector("source");
            player.src = s.src;
          } else {
            const clone = video.cloneNode(true);
            clone.controls = true;
            clone.autoplay = true;
            clone.style.cssText = "display:block;width:100%;height:auto;background:#000;";
            box.appendChild(toolbar);
            box.appendChild(clone);
            document.body.appendChild(box);
          }

          toolbar.appendChild(title);
          toolbar.appendChild(close);

          if (!box.contains(player)) {
            box.appendChild(toolbar);
            box.appendChild(player);
            document.body.appendChild(box);
          }

          close.onclick = () => box.remove();

          let down = false;
          let ox = 0;
          let oy = 0;

          toolbar.onmousedown = (e) => {
            down = true;
            ox = e.offsetX;
            oy = e.offsetY;
          };

          document.onmouseup = () => down = false;

          document.onmousemove = (e) => {
            if (!down) return;
            box.style.left = `${e.pageX - ox}px`;
            box.style.top = `${e.pageY - oy}px`;
            box.style.right = "auto";
            box.style.bottom = "auto";
          };
        }
      });
    });
  });

  addTopButton("⚙️ Настройки", () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("assist_src/settings.html")
    });
  });
}

async function loadModulesSafely() {
  try {
    const registryUrl = chrome.runtime.getURL("assist_src/func_src/registry.js");
    const registry = await import(registryUrl);
    const modules = Array.isArray(registry.default) ? registry.default : [];

    for (const modFile of modules) {
      try {
        const modUrl = chrome.runtime.getURL(`assist_src/func_src/${modFile}`);
        const mod = await import(modUrl);

        if (typeof mod.registerFunctions === "function") {
          mod.registerFunctions(registerFunction);
        } else {
          console.warn(`Модуль ${modFile} не экспортирует registerFunctions()`);
        }
      } catch (e) {
        console.warn(`Не удалось загрузить модуль ${modFile}`, e);
      }
    }
  } catch (e) {
    console.warn("registry.js не загрузился, но основные кнопки работают", e);
  }
}

applyTheme();
renderStaticButtons();
loadModulesSafely();