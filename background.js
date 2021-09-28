// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (changeInfo.status == "complete") {
//     console.log("changed");
//   }
// });
// chrome.tabs.query({}, (tabs) => {
//   ;
//   let filtered = tabs.filter((element) => {
//     if (element.url.includes("https")) {
//       return false;
//     } else {
//       return true;
//     }
//   });
//   console.log(filtered);
// });

chrome.tabs.create({ url: "timer.html" });

try {
  chrome.runtime.sendMessage({ data: "openCheck" }, (response) => {
    console.log(response);
    console.log("message sent");
  });
} catch {
  chrome.tabs.create({ url: "timer.html" });
}

// // Gets from chrome storage, runs if statement
// chrome.storage.sync.get("banned", (obj) => {
//   bannedUrls = obj.banned;
//   if (bannedUrls.includes(currUrl)) {
//     console.log("should be dark");
//     darkness();
//   }
// });
