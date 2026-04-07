// const loadbtn = document
//     .getElementById("load-btn")
//     .addEventListener("click", () => {
//         chrome.tabs.query({ active: true }, (tabs) => {
//             const tab = tabs[0];
//             if(tab){
//                 chrome.scripting.executeScript({
//                     target: { tabId: tab.id },
//                     func: selectImages
//                 },
//                 onResultParsing
//             );}else{
//                 console.log("No active tab!");
//             }
//         });
//     });

// let currentImages = [];

// function selectImagesFromPage() {
//     const images = document.querySelectorAll('img');
//     return Array.from(images).map((img, idx) => ({
//         url: img.src,
//         alt: img.alt || `image_${idx + 1}`,
//         width: img.width,
//         height: img.height
//     })).filter(img => img.url && img.url.startsWith('http'));
// }

// function onResultParsing(arr){

// }