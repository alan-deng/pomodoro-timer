var tones = {
  chime: "audio/chime.mp3",
};

var timerInfo = {
  currInterval: -1,
  timerPaused: false,
  timeLeft: 0,
  cyclePhrase: "Timer Not Started",
  minLeft: "0",
  secLeft: "00",
};

var userOptions = {
  alarmSound: new Audio(tones["chime"]),
  bannedUrls: [],
};
userOptions.alarmSound.loop = true;

var getUserChoices = () => {
  chrome.storage.sync.get(
    {
      workLength: 25,
      breakLength: 5,
      longBreakLength: 15,
      numWorkIntervals: 4,
      bannedUrls: [
        "https://www.facebook.com",
        "https://www.youtube.com",
        "https://www.instagram.com",
        "https://www.twitter.com",
        "https://www.tiktok.com",
        "https://www.pininterest.com",
        "https://www.snapchat.com",
      ],
    },
    ({
      workLength,
      breakLength,
      longBreakLength,
      numWorkIntervals,
      bannedUrls,
    }) => {
      timerInfo.workTimerMs = workLength * 1000 * 60;
      timerInfo.breakTimerMs = breakLength * 1000 * 60;
      timerInfo.longBreakMs = longBreakLength * 1000 * 60;
      timerInfo.numWorkIntervals = numWorkIntervals;
      userOptions.bannedUrls = bannedUrls;
    }
  );
};

// Timer Function
var startTimer = (timerLengthInMs) => {
  timerInfo.timerEnd = Date.now() + timerLengthInMs;

  const updateTimer = () => {
    timerInfo.timeLeft = Math.floor((timerInfo.timerEnd - Date.now()) / 1000);
    timerInfo.minLeft = Math.floor(timerInfo.timeLeft / 60).toString();
    timerInfo.secLeft = (timerInfo.timeLeft % 60).toString().padStart(2, "0");
    chrome.browserAction.setBadgeText({
      text:
        timerInfo.minLeft > 0
          ? `${timerInfo.minLeft}m`
          : `${timerInfo.secLeft}s`,
    });
    if (timerInfo.timeLeft <= 0) {
      clearInterval(timerInfo.timerInterval);
      endCycleAction();
    }
  };

  timerInfo.timerInterval = setInterval(updateTimer, 1000);
};

var stopTimer = () => {
  clearInterval(timerInfo.timerInterval);
  timerInfo.currInterval = -1;
  timerInfo.timeLeft = 0;
  timerInfo.minLeft = "0";
  timerInfo.secLeft = "00";
  timerInfo.cyclePhrase = "Timer Not Started";
  chrome.browserAction.setBadgeText({ text: "" });
  toggleDark();
};

const playAlarm = () => {
  userOptions.alarmSound.play();
  setTimeout(() => {
    userOptions.alarmSound.pause();
  }, 5000);
};

var endCycleAction = () => {
  if (timerInfo.currInterval != -1) {
    playAlarm();
  }
  timerInfo.currInterval =
    ++timerInfo.currInterval % (timerInfo.numWorkIntervals * 2); //# work intervals * 2 = # work intervals + # breaks
  // curr cycle odd means on break, even means work
  switch (false) {
    case Boolean(timerInfo.currInterval % 2):
      timerInfo.cyclePhrase = `Work Time: Interval ${
        timerInfo.currInterval / 2 + 1
      }`;
      startTimer(timerInfo.workTimerMs);
      break;
    case Boolean(timerInfo.currInterval === timerInfo.numWorkIntervals * 2 - 1): // interval of long break
      timerInfo.cyclePhrase = "Break Time";
      startTimer(timerInfo.breakTimerMs);
      break;
    default:
      timerInfo.cyclePhrase = "Long Break!";
      startTimer(timerInfo.longBreakMs);
  }

  toggleDark();
};

const toggleDark = () => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.url.includes("http")) {
        if (checkBanned(tab.url)) {
          chrome.tabs.executeScript(tab.id, {
            file: Boolean(timerInfo.currInterval % 2)
              ? "removeDark.js"
              : "insertDark.js",
          });
        }
      }
    }
  });
};

const checkBanned = (url) => {
  for (const bannedUrl of userOptions.bannedUrls) {
    if (url.includes(bannedUrl)) {
      return true;
    }
  }
  return false;
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    timerInfo.timeLeft > 0 &&
    checkBanned(tab.url)
  ) {
    toggleDark();
  }
});

getUserChoices();
