const loadbtn = document
    .getElementById("load-btn")
    .addEventListener("click", () => {
        chrome.tabs.query({ active: true }, (tabs) => {
            const tab = tabs[0];
            if(tab){
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: selectImages
                },
                onResultParsing
            );}else{
                console.log("No active tab!");
            }
        });
    });

function selectImagesFromPage() {
    const images = document.getElementById("img");
    return Array.from(images).map(image => image.src);
}

function onResultParsing(arr){
    const imagesUrl = frames.map(frame => frame.result)
        .reduce((r1, r2) => r1.concat(r2));
    window.navigation.clipboard.writeText(imagesUrl).then(window.close());
}