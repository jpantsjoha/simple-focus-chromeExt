const startButton = document.getElementById("start-timer");
const stopButton = document.getElementById("stop-timer");
const timerDisplay = document.getElementById("timer-display");
const timerSlider = document.getElementById("timer-slider");
const countdownDisplay = document.getElementById("countdown-display");

timerSlider.addEventListener("input", () => {
  const focusTime = timerSlider.value;
  timerDisplay.textContent = `${focusTime}:00`;
  // Store the focus time setting
  chrome.storage.sync.set({ focusTimeSetting: focusTime });
});

//Todo Fix Async issue with state setting to chrome background
chrome.storage.sync.get("focusTimeSetting", (data) => {
  // Retrieve the focus time 
  if (data.focusTimeSetting) {
    timerDisplay.textContent = `${data.focusTimeSetting}:00`;
    timerSlider.value = data.focusTimeSetting;
  }
});

startButton.addEventListener("click", () => {
  const duration = parseInt(timerSlider.value);
  chrome.runtime.sendMessage({ command: "startTimer", duration: duration });
});

stopButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stopTimer" });
});

chrome.runtime.sendMessage({ command: "requestCountdownState" }, (response) => {
  if (response.remainingSeconds !== null) {
    updateCountdownDisplay(response.remainingSeconds);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "updateCountdown") {
    updateCountdownDisplay(message.remainingSeconds);
  }
});

function updateCountdownDisplay(remainingSeconds) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  countdownDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.command === "timerFinished") {
    alert("Focus Time Finished!");
    // Play the soft ping sound
    const audio = new Audio(chrome.runtime.getURL('../clock_alarm.mp3'));
    audio.play();
  }
});


