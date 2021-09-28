let timerInterval;
// curr cycle odd means on break, even means work
const timerInfo = {
  currInterval: -1,
  timerPaused: false,
  timeLeft: 0,
};
chrome.storage.sync.get(
  {
    workTimer: 1000 * 60 * 1,
    breakTimer: 1000 * 60 * 1,
    longBreak: 1000 * 60 * 2,
  },
  ({ workTimer, breakTimer, longBreak }) => {
    timerInfo.workTimerMs = workTimer;
    timerInfo.breakTimerMs = breakTimer;
    timerInfo.longBreakMs = longBreak;
  }
);

// Timer Function
const startTimer = (timerLengthInMs) => {
  timerInfo.timerEnd = Date.now() + timerLengthInMs;
  const updateTimer = () => {
    timerInfo.timeLeft = Math.floor((timerEnd - Date.now()) / 1000);
    document.getElementById("timer").innerHTML = timerInfo.timeLeft;
    if (timerInfo.timeLeft <= 0) {
      clearInterval(timerInterval);
      endCycleAction();
    }
  };
  timerInterval = setInterval(updateTimer, 1000);
};

const endCycleAction = () => {
  timerInfo.currInterval = ++timerInfo.currInterval % 8;
  console.log(`cycle number: ${timerInfo.currInterval}`);
  let cyclePhrase;
  // curr cycle odd means on break, even means work
  switch (false) {
    case Boolean(timerInfo.currInterval % 2):
      cyclePhrase = `Work Time: Interval ${timerInfo.currInterval / 2 + 1}`;
      startTimer(workTimerMs);
      break;
    case Boolean(timerInfo.currInterval === 7):
      cyclePhrase = "Break Time";
      startTimer(breakTimerMs);
      break;
    default:
      cyclePhrase = "Long Break!";
      startTimer(longBreakMs);
  }
  document.getElementById("phase").innerHTML = cyclePhrase;
  toggleDark();
};

const addDark = () => {
  try {
    const styleDiv = (darknessDiv) => {
      darknessDiv.style.backgroundColor = "black";
      darknessDiv.style.height = "100vh";
      darknessDiv.style.width = "100vw";
      darknessDiv.style.position = "fixed";
      darknessDiv.style.zIndex = 9999;
      darknessDiv.id = "darknessDiv";
    };
    const darknessDiv = document.createElement("div");
    styleDiv(darknessDiv);
    document.body.prepend(darknessDiv);
  } catch {
    styleDiv(darknessDiv);
    document.body.prepend(darknessDiv);
  }
};

const removeDark = () => {
  document.getElementById("darknessDiv").remove();
};

let toggleDark = () => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: Boolean(timerInfo.currInterval % 2) ? removeDark : addDark,
      });
    }
  });
};

// Communicates with popup.js to give it timeLeft to display
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.data == "openCheck") {
    chrome.runtime.sendMessage({ openCheck: "isOpen" });
  } else {
    chrome.runtime.sendMessage({ data: timerInfo.timeLeft });
  }
});

// startTimer(workTimerMs);
// endCycleAction();

document
  .getElementById("start-timer-button")
  .addEventListener("click", endCycleAction);
