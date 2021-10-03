// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("receiving in popup" + request.message);
//   if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
// });

// Sends handshake message and gets time left back, displays time left in popup (also displayed in background page)
// setInterval(() => {
//   chrome.runtime.sendMessage({ data: "Time Left Data Request" });
//   console.log("requested data");
// }, 1000);
// let minLeft, secLeft;
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   minLeft = Math.floor(message.data / 60);
//   secLeft = (message.data % 60).toString().padStart(2, "0");
//   document.getElementById("timer").innerHTML = `${minLeft}:${secLeft}`;
// });

let bgPage = chrome.extension.getBackgroundPage();

document.getElementById("start-timer-button").addEventListener("click", () => {
  bgPage.endCycleAction();
});
document.getElementById("stop-timer-button").addEventListener("click", () => {
  bgPage.stopTimer();
});

const updateTimer = () => {
  document.getElementById(
    "timer"
  ).innerHTML = `${bgPage.timerInfo.minLeft}:${bgPage.timerInfo.secLeft}`;
  document.getElementById("timer-message").innerHTML =
    bgPage.timerInfo.cyclePhrase;
};

setInterval(updateTimer, 1000);
