const loadBtn = document.getElementById('load-btn');
const downloadAllBtn = document.getElementById('download-all-btn');
const imagesContainer = document.getElementById('images-container');
const loaderDiv = document.getElementById('loader');

let currentImages = [];

function selectImagesFromPage() {
    const images = document.querySelectorAll('img');
    return Array.from(images).map((img, idx) => ({
        url: img.src,
        alt: img.alt || `image_${idx + 1}`,
        width: img.width,
        height: img.height
    })).filter(img => img.url && img.url.startsWith('http'));
}

function downloadImage(url, filename) {
    chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: false
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error(`Ошибка скачивания ${filename}: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Скачивание начато: ${filename} (id: ${downloadId})`);
        }
    });
}

function makeFilename(image, index) {
    let ext = 'jpg';
    const match = image.url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i);
    if (match) ext = match[1];
    let baseName = (image.alt || `image_${index + 1}`)
        .replace(/[\\/:*?"<>|]/g, '')
        .substring(0, 50);
    if (!baseName) baseName = `image_${index + 1}`;
    return `${baseName}.${ext}`;
}

function renderImages(images) {
    imagesContainer.innerHTML = '';
    if (!images.length) {
        imagesContainer.innerHTML = '<p style="color: #ff8888;">❌ Изображения не найдены на этой странице.</p>';
        downloadAllBtn.classList.add('hidden');
        return;
    }

    images.forEach((img, idx) => {
        const card = document.createElement('div');
        card.className = 'card';

        const preview = document.createElement('img');
        preview.className = 'preview';
        preview.src = img.url;
        preview.alt = img.alt;
        preview.onerror = () => { preview.src = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%23ffa500%22%3E%3Cpath%20d%3D%22M19%203H5c-1.1%200-2%20.9-2%202v14c0%201.1.9%202%202%202h14c1.1%200%202-.9%202-2V5c0-1.1-.9-2-2-2zm-1%2015h-2.5l-2-3-2%204-3-5-2%204H6l4-6%203%204%202-3%203%204z%22%2F%3E%3C%2Fsvg%3E'; };

        const infoDiv = document.createElement('div');
        infoDiv.className = 'card-info';
        infoDiv.innerHTML = `
            <strong>${img.alt.substring(0, 40)}</strong>
            <span>${img.width}×${img.height}</span>
            <span title="${img.url}">${img.url.substring(0, 60)}${img.url.length > 60 ? '…' : ''}</span>
        `;

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '⬇️ Скачать';
        downloadBtn.className = 'download-single-btn';
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const filename = makeFilename(img, idx);
            downloadImage(img.url, filename);
        });

        card.appendChild(preview);
        card.appendChild(infoDiv);
        card.appendChild(downloadBtn);
        imagesContainer.appendChild(card);
    });

    downloadAllBtn.classList.remove('hidden');
}

function downloadAll() {
    if (!currentImages.length) return;
    currentImages.forEach((img, idx) => {
        const filename = makeFilename(img, idx);
        setTimeout(() => downloadImage(img.url, filename), idx * 200);
    });
}

function onResultParsing(injectionResultArray) {
    loaderDiv.classList.add('hidden');
    if (injectionResultArray && injectionResultArray[0] && injectionResultArray[0].result) {
        currentImages = injectionResultArray[0].result;
        renderImages(currentImages);
    } else {
        currentImages = [];
        renderImages([]);
    }
}

loadBtn.addEventListener('click', () => {
    imagesContainer.innerHTML = '';
    downloadAllBtn.classList.add('hidden');
    loaderDiv.classList.remove('hidden');
    currentImages = [];

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab) {
            loaderDiv.classList.add('hidden');
            imagesContainer.innerHTML = '<p style="color: #ff8888;">❌ Нет активной вкладки.</p>';
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: selectImagesFromPage
        }, (results) => {
            if (chrome.runtime.lastError) {
                loaderDiv.classList.add('hidden');
                imagesContainer.innerHTML = `<p style="color: #ff8888;">⚠️ Ошибка: ${chrome.runtime.lastError.message}</p>`;
                return;
            }
            onResultParsing(results);
        });
    });
});

downloadAllBtn.addEventListener('click', downloadAll);