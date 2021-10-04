let bgPage = chrome.extension.getBackgroundPage();

document.getElementById("start-timer-button").addEventListener("click", () => {
  bgPage.endCycleAction();
});
document.getElementById("stop-timer-button").addEventListener("click", () => {
  bgPage.stopTimer();
});

document
  .getElementById("change-settings-button")
  .addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

const updateTimer = () => {
  document.getElementById(
    "timer"
  ).innerHTML = `${bgPage.timerInfo.minLeft}:${bgPage.timerInfo.secLeft}`;
  document.getElementById("timer-message").innerHTML =
    bgPage.timerInfo.cyclePhrase;
};

setInterval(updateTimer, 1000);
