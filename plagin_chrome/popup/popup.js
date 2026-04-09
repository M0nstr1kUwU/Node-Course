const loadBtn = document.getElementById("load-btn")
  .addEventListener("click", () => {
    chrome.tabs.query({active: true}, (tabs) => {
      const tab = tabs[0];
      if(tab){
        chrome.scripting.executeScript({
          target: {tabId: tab.id, allFrames: true}, 
          func: selectImages
        },
        onResult
        );
      }
    });
  });

function selectImages(){
  const images = document.querySelectorAll("img");
  return Array.from(images).map(image => image.src);
}

function onResult(frames){
  const imageUrls = frames.map(frame => frame.result)
    .reduce((r1, r2) => r1.concat(r2));

  toPageImages(imageUrls);
}

function toPageImages(urls){
  chrome.tabs.create({ url: "pages/page.html", active: false}, (tab) => {
    chrome.runtime.sendMessage(tab.id, urls, (response) => {
      chrome.tabs.update(tab.id, { active: true });
    });
  });
}
