chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse("OK");
    addImagesToConatiner(message)

})

function addImagesToConatiner(urls) {
    document.writeText(JSON.stringify(urls))
}