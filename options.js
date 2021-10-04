let bgPage = chrome.extension.getBackgroundPage();
let n = 1;
chrome.storage.sync.get(
  {
    workLength: 1000 * 60 * 1,
    breakLength: 1000 * 60 * 2,
    longBreakLength: 1000 * 60 * 2,
    numWorkIntervals: 4,
    bannedUrls: [
      "facebook.com",
      "youtube.com",
      "instagram.com",
      "twitter.com",
      "tiktok.com",
      "pininterest.com",
      "snapchat.com",
    ],
  },
  ({
    workLength,
    breakLength,
    longBreakLength,
    numWorkIntervals,
    bannedUrls,
  }) => {
    // creates banned urls list in DOM
    for (const url of bannedUrls) {
      let newElem = document.createElement("li");
      newElem.innerHTML = `<input type="text" class="form-control" id='banned-url-${n}' value='${url}'></input>`;
      document.getElementById("banned-urls-list").append(newElem);
      n++;
    }
    document.getElementById("work-length").setAttribute("value", workLength);
    document.getElementById("break-length").setAttribute("value", breakLength);
    document
      .getElementById("long-break-length")
      .setAttribute("value", longBreakLength);
    document
      .getElementById("num-work-intervals")
      .setAttribute("value", numWorkIntervals);
  }
);

document.getElementById("add-banned-url").addEventListener("click", () => {
  let newElem = document.createElement("li");
  newElem.innerHTML = `<input type="text" class="form-control" id='banned-url-${n}'></input>`;
  document.getElementById("banned-urls-list").append(newElem);
  n++;
});

// stops form submission, and sets options in chrome.storage
document.getElementById("options").addEventListener("submit", (e) => {
  e.preventDefault();
  let inputList = document.querySelectorAll("input");
  let workLength = 1,
    breakLength = 1,
    longBreakLength = 2,
    numWorkIntervals = 4,
    bannedUrls = [];
  for (input of inputList) {
    if (input.value) {
      switch (true) {
        case input.id === "work-length":
          workLength = parseFloat(input.value);
          break;
        case input.id === "break-length":
          breakLength = parseFloat(input.value);
          break;
        case input.id === "long-break-length":
          longBreakLength = parseFloat(input.value);
          break;
        case input.id === "num-work-intervals":
          numWorkIntervals = parseFloat(input.value);
          break;
        case input.id.includes("banned-url"):
          const parsedUrl = parseUrlChoice(input.value);
          bannedUrls.push(parsedUrl);
          break;
      }
    }
  }
  chrome.storage.sync.set({
    workLength,
    breakLength,
    longBreakLength,
    numWorkIntervals,
    bannedUrls,
  });
  bgPage.getUserChoices();
  closePage();
});
const parseUrlChoice = (url) => {
  const regexp =
    /(https?:\/\/)?(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.)+([a-z]{2,4})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
  const regMatchArr = url.match(regexp);
  //groups 3 and 4 match XYZ.com group 5 matches everything after
  const noHTTPUrl = regMatchArr[3] + regMatchArr[4] + regMatchArr[5];
  return "https://www." + noHTTPUrl;
};

const closePage = () => {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id);
  });
};
