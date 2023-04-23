const startButton = document.getElementById("start-timer");
const pauseContinueButton = document.getElementById("pause-continue-timer");
const resetButton = document.getElementById("reset-timer");
const timerDisplay = document.getElementById("timer-display");
const timerSlider = document.getElementById("timer-slider");

startButton.addEventListener("click", () => {
  const duration = parseInt(timerSlider.value);
  chrome.runtime.sendMessage({ command: "startTimer", duration: duration });
});

pauseContinueButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "togglePauseContinue" });
});

resetButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "resetTimer" });
  timerDisplay.textContent = `${timerSlider.value}:00`;
});

timerSlider.addEventListener("input", () => {
  timerDisplay.textContent = `${timerSlider.value}:00`;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "updateTimerDisplay") {
    updateTimerDisplay(request.timeRemaining);
  }
});

function updateTimerDisplay(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
