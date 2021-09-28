currUrl = window.location.href;
// Sets in chrome storage
chrome.storage.sync.set({ banned: [currUrl] }, function () {
  console.log("Set in storage");
});

chrome.runtime.onConnect.addListener((port) => {
  console.log("Connected .....");
  port.onMessage.addListener((msg) => {
    console.log("message recieved" + msg);
    port.postMessage("Hi Popup.js");
  });
});
