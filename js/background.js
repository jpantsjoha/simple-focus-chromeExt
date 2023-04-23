const startButton = document.getElementById("start-timer");
const stopButton = document.getElementById("stop-timer");
const timerDisplay = document.getElementById("timer-display");
const timerSlider = document.getElementById("timer-slider");

let timerId = null;

startButton.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  const duration = parseInt(timerSlider.value);
  let timeRemaining = duration * 60;
  timerId = setInterval(() => {
    timeRemaining--;

    if (timeRemaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      alert("Timer Ended");
    }

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
});

stopButton.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
});

timerSlider.addEventListener("input", () => {
  timerDisplay.textContent = `${timerSlider.value}:00`;
});

// ----- Merging both

let startTime;
let endTime;
let countdownInterval = null;
let countdownState = {
  remainingSeconds: null,
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "startTimer") {
        const duration = message.duration * 60; // Convert minutes to seconds
        startTime = new Date().getTime();
        endTime = startTime + duration * 1000;
        clearInterval(countdownInterval);
    
        countdownInterval = setInterval(() => {
          const currentTime = new Date().getTime();
          const remainingSeconds = Math.round((endTime - currentTime) / 1000);
    
          if (remainingSeconds <= 0) {
            clearInterval(countdownInterval);
            countdownState.remainingSeconds = null;
            // Play the soft ping sound
            new Audio('clock_alarm.mp3').play();
          } else {
            countdownState.remainingSeconds = remainingSeconds;
            chrome.runtime.sendMessage({
              command: "updateCountdown",
              remainingSeconds: remainingSeconds,
            });
          }
        }, 1000);
      } else if (message.command === "stopTimer") {
        clearInterval(countdownInterval);
        countdownState.remainingSeconds = null;
      } else if (message.command === "requestCountdownState") {
        sendResponse(countdownState);
      }
    });
    
    