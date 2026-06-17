export function registerFunctions(register) {
  register({
    name: "🎵 Скачать музыку",
    render: (container, getTabId) => {
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";

      container.innerHTML = `
        <button id="scan-music">🔍 Найти аудио</button>
        <div id="music-loader" style="display:none;">Поиск...</div>
        <div id="music-list" style="display:flex;flex-direction:column;gap:6px;margin-top:6px;"></div>
      `;

      const scanBtn = container.querySelector("#scan-music");
      const loader = container.querySelector("#music-loader");
      const listDiv = container.querySelector("#music-list");

      // Функция, которая выполняется на странице
      function extractAudioFromPage() {
        const audioElements = Array.from(document.querySelectorAll("audio"));
        const sources = new Set();

        // Из тегов <audio>
        audioElements.forEach(audio => {
          if (audio.src && audio.src.startsWith("http")) sources.add(audio.src);
          Array.from(audio.querySelectorAll("source")).forEach(source => {
            if (source.src && source.src.startsWith("http")) sources.add(source.src);
          });
        });

        // Ссылки на аудиофайлы
        const links = Array.from(document.querySelectorAll("a[href]"));
        links.forEach(link => {
          const href = link.href;
          if (/\.(mp3|wav|ogg|m4a|flac)(\?|$)/i.test(href)) {
            sources.add(href);
          }
        });

        // Также проверим все <source> вне <audio> (редко)
        document.querySelectorAll("source[src]").forEach(src => {
          if (src.src && src.src.startsWith("http") && /audio/i.test(src.type)) {
            sources.add(src.src);
          }
        });

        return Array.from(sources).map((url, idx) => ({
          url: url,
          name: decodeURIComponent(url.split("/").pop() || `audio_${idx+1}.mp3`)
        }));
      }

      function downloadTrack(url, filename) {
        chrome.runtime.sendMessage({ type: "download", url, filename });
      }

      function renderMusicList(tracks) {
        listDiv.innerHTML = "";
        if (tracks.length === 0) {
          listDiv.innerHTML = "<div class='small-note'>Аудио не найдено</div>";
          return;
        }
        tracks.forEach((track, i) => {
          const item = document.createElement("div");
          item.style.cssText = `
            background: var(--panel);
            border-radius: 12px;
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          `;
          item.innerHTML = `
            <span style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${track.name}">${track.name}</span>
            <button style="padding:4px 8px;">⬇️</button>
          `;
          item.querySelector("button").onclick = () => downloadTrack(track.url, track.name);
          listDiv.appendChild(item);
        });
      }

      scanBtn.onclick = () => {
        loader.style.display = "block";
        listDiv.innerHTML = "";
        getTabId(tabId => {
          chrome.scripting.executeScript(
            { target: { tabId }, func: extractAudioFromPage },
            (results) => {
              loader.style.display = "none";
              if (chrome.runtime.lastError) {
                listDiv.innerHTML = `<div class="small-note">Ошибка: ${chrome.runtime.lastError.message}</div>`;
                return;
              }
              const tracks = results?.[0]?.result || [];
              renderMusicList(tracks);
            }
          );
        });
      };
    }
  });
}