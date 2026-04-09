export function registerFunctions(register) {
  // 🔹 Ускорить видео
  register({
    name: "🎬 Ускорить видео x2",
    render: (container, getTabId) => {
      const btn = document.createElement("button");
      btn.textContent = "x2";
      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => { document.querySelectorAll("video").forEach(v => v.playbackRate = 2); }
        });
      });
      container.appendChild(btn);
    }
  });

  // 🔹 Выключить звук
  register({
    name: "🔇 Выключить звук",
    render: (container, getTabId) => {
      const btn = document.createElement("button");
      btn.textContent = "Mute";
      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => { document.querySelectorAll("video").forEach(v => v.muted = true); }
        });
      });
      container.appendChild(btn);
    }
  });

  // 🔹 Скачать видео
  register({
    name: "📥 Скачать видео",
    render: (container, getTabId) => {
      const btn = document.createElement("button");
      btn.textContent = "Скачать видео";
      btn.onclick = () => getTabId(tabId => {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => Array.from(document.querySelectorAll("video")).map(v => v.src)
        }, (res) => {
          res[0].result.forEach((url, i) => chrome.runtime.sendMessage({ type: "download", url, filename: `video_${i}.mp4` }));
        });
      });
      container.appendChild(btn);
    }
  });

  // 🔹 Скриншот страницы
  register({
    name: "📸 Скриншот страницы",
    render: (container) => {
      const btn = document.createElement("button");
      btn.textContent = "Сделать скриншот";
      btn.onclick = () => chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "screenshot.png";
        a.click();
      });
      container.appendChild(btn);
    }
  });
}