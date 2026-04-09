export function registerFunctions(register) {
  register({
    name: "📥 Скачать изображения",
    render: (container, getTabId) => {

      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";

      container.innerHTML = `
        <div style="display:flex;gap:8px;">
          <button id="load-btn">Загрузить</button>
          <button id="download-all-btn" style="display:none;">Скачать все</button>
        </div>
        <div id="loader" style="display:none;">Загрузка...</div>
        <div id="images-container" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;"></div>
      `;

      const loadBtn = container.querySelector("#load-btn");
      const downloadAllBtn = container.querySelector("#download-all-btn");
      const loaderDiv = container.querySelector("#loader");
      const imagesContainer = container.querySelector("#images-container");

      let currentImages = [];

      function selectImagesFromPage() {
        const imgs = document.querySelectorAll("img");
        return Array.from(imgs)
          .map((img, idx) => ({
            url: img.src,
            alt: img.alt || `image_${idx+1}`,
            width: img.width,
            height: img.height
          }))
          .filter(img => img.url && img.url.startsWith("http"));
      }

      function downloadImage(url, filename) {
        chrome.runtime.sendMessage({ type: "download", url, filename });
      }

      function renderImages(images) {
        imagesContainer.innerHTML = "";
        images.forEach((img, idx) => {
          const card = document.createElement("div");
          card.style.cssText = `
            display:flex;
            flex-direction:column;
            align-items:center;
            background: var(--card);
            padding:6px;
            border-radius:10px;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            transition:0.2s;
          `;
          card.innerHTML = `
            <img src="${img.url}" style="width:100%;max-height:120px;object-fit:cover;border-radius:6px;">
            <button style="margin-top:4px;">⬇️ Скачать</button>
          `;
          card.querySelector("button").onclick = () => downloadImage(img.url, `${img.alt}.jpg`);
          imagesContainer.appendChild(card);
        });
        if (images.length > 0) downloadAllBtn.style.display = "inline-block";
      }

      loadBtn.onclick = () => {
        loaderDiv.style.display = "block";
        getTabId(tabId => {
          chrome.scripting.executeScript(
            { target: { tabId }, func: selectImagesFromPage },
            (res) => {
              loaderDiv.style.display = "none";
              currentImages = res[0].result;
              renderImages(currentImages);
            }
          );
        });
      };

      downloadAllBtn.onclick = () => {
        currentImages.forEach((img, i) => {
          setTimeout(() => {
            downloadImage(img.url, `${img.alt}_${i}.jpg`);
          }, i * 200);
        });
      };
    }
  });
}