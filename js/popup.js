const startButton = document.getElementById("start-timer");
const stopButton = document.getElementById("stop-timer");
const timerDisplay = document.getElementById("timer-display");
const timerSlider = document.getElementById("timer-slider");
const countdownDisplay = document.getElementById("countdown-display");

timerSlider.addEventListener("input", () => {
  timerDisplay.textContent = `${timerSlider.value}:00`;
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
