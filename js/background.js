chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "startTimer") {
    startTimer(request.duration);
  } else if (request.command === "togglePauseContinue") {
    togglePauseContinue();
  } else if (request.command === "resetTimer") {
    resetTimer();
  }
});

let timerId = null;
let timeRemaining = null;

function startTimer(duration) {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  timeRemaining = duration * 60;
  timerId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeRemaining--;

  if (timeRemaining <= 0) {
    clearInterval(timerId);
    timerId = null;
    // You can replace this alert with a notification or other user prompt
    alert("Timer Ended");
  }

  chrome.runtime.sendMessage({ command: "updateTimerDisplay", timeRemaining: timeRemaining });
}

function togglePauseContinue() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    timerId = setInterval(updateTimer, 1000);
  }
}

function resetTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  timeRemaining = null;
}
