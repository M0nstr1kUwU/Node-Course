chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse("OK");
    console.log(message.urls);
    addImagesToContainer(message.urls);
})

function addImagesToContainer(urls) {
    // document.write(JSON.stringify(urls));
    const container = document.querySelectorAll(".container");
    urls.forEach((url) => renderImage(container, url));
}

function renderImage(container, url){
    if(!url){
        return; 
    }
    const div = document.createElement("div");
    div.className = "div-img";
    const image = document.createElement("img");
    image.src = url;
    div.appendChild(image);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("url", url);
    div.appendChild(checkbox);
    container.appendChild(div);
}