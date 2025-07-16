// DOM elements
const startPomodoroBtn = document.getElementById("start-pomodoro");
const startCustomBtn = document.getElementById("start-custom");
const startCustomTimerBtn = document.getElementById("start-custom-timer");
const pauseBtn = document.getElementById("pause-timer");
const resumeBtn = document.getElementById("resume-timer");
const stopBtn = document.getElementById("stop-timer");
const themeToggle = document.getElementById("theme-toggle");
const timerDisplay = document.getElementById("timer-display");
const timerSlider = document.getElementById("timer-slider");
const countdownDisplay = document.getElementById("countdown-display");
const sessionTypeDisplay = document.getElementById("session-type-display");
const sessionCounter = document.getElementById("session-counter");
const timerControls = document.getElementById("timer-controls");
const customTimerSection = document.getElementById("custom-timer-section");
const progressFill = document.getElementById("progress-fill");
const cycleDots = document.querySelectorAll(".dot");

let originalDuration = 0;
let isDarkMode = false;

// Load saved settings
chrome.storage.sync.get(["focusTimeSetting", "darkMode"], (data) => {
  if (data.focusTimeSetting) {
    timerDisplay.textContent = `${data.focusTimeSetting} min`;
    timerSlider.value = data.focusTimeSetting;
  }
  if (data.darkMode) {
    isDarkMode = data.darkMode;
    updateTheme();
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  updateTheme();
  chrome.storage.sync.set({ darkMode: isDarkMode });
});

function updateTheme() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  themeToggle.textContent = isDarkMode ? "◑" : "◐";
}

// Timer slider
timerSlider.addEventListener("input", () => {
  const focusTime = timerSlider.value;
  timerDisplay.textContent = `${focusTime} min`;
  chrome.storage.sync.set({ focusTimeSetting: focusTime });
});

// Button event listeners
startPomodoroBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "startPomodoroCycle" });
  showTimerControls();
});

startCustomBtn.addEventListener("click", () => {
  customTimerSection.classList.toggle("hidden");
});

startCustomTimerBtn.addEventListener("click", () => {
  const duration = parseInt(timerSlider.value);
  chrome.runtime.sendMessage({ command: "startTimer", duration: duration });
  showTimerControls();
  customTimerSection.classList.add("hidden");
});

pauseBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "pauseTimer" });
  pauseBtn.classList.add("hidden");
  resumeBtn.classList.remove("hidden");
});

resumeBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "resumeTimer" });
  resumeBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
});

stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stopTimer" });
  hideTimerControls();
  resetUI();
});

function showTimerControls() {
  timerControls.classList.remove("hidden");
  startPomodoroBtn.classList.add("hidden");
  startCustomBtn.classList.add("hidden");
}

function hideTimerControls() {
  timerControls.classList.add("hidden");
  startPomodoroBtn.classList.remove("hidden");
  startCustomBtn.classList.remove("hidden");
  pauseBtn.classList.remove("hidden");
  resumeBtn.classList.add("hidden");
}

function resetUI() {
  countdownDisplay.textContent = "25:00";
  sessionTypeDisplay.textContent = "Focus Session";
  sessionCounter.textContent = "Session 1 of 4";
  updateProgressBar(0);
  updateCycleDots(0);
}

function updateProgressBar(percentage) {
  progressFill.style.width = `${percentage}%`;
}

function updateCycleDots(position) {
  cycleDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === position);
    dot.classList.toggle("completed", index < position);
  });
}

// Get initial state
chrome.runtime.sendMessage({ command: "requestCountdownState" }, (response) => {
  if (response && response.remainingSeconds !== null) {
    updateUI(response);
    showTimerControls();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  // Only process shortcuts if no input elements are focused
  if (document.activeElement.tagName === 'INPUT') return;
  
  switch(event.key) {
    case ' ': // Spacebar - Start/Pause/Resume
      event.preventDefault();
      if (timerControls.classList.contains('hidden')) {
        startPomodoroBtn.click();
      } else if (!pauseBtn.classList.contains('hidden')) {
        pauseBtn.click();
      } else {
        resumeBtn.click();
      }
      break;
    case 'Escape': // Escape - Stop timer
      if (!timerControls.classList.contains('hidden')) {
        stopBtn.click();
      }
      break;
    case 'c': // C - Custom timer
      if (timerControls.classList.contains('hidden')) {
        startCustomBtn.click();
      }
      break;
    case 'd': // D - Dark mode toggle
      themeToggle.click();
      break;
  }
});

// Listen for updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.command === "updateCountdown") {
    updateUI(message);
  } else if (message.command === "timerFinished") {
    handleTimerFinished(message);
  }
});

function updateUI(data) {
  updateCountdownDisplay(data.remainingSeconds);
  updateSessionInfo(data.sessionType, data.sessionCount, data.cyclePosition);
  updateCycleDots(data.cyclePosition);
  
  // Update progress bar
  if (originalDuration > 0) {
    const percentage = ((originalDuration - data.remainingSeconds) / originalDuration) * 100;
    updateProgressBar(percentage);
  }
}

function updateCountdownDisplay(remainingSeconds) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  countdownDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  
  // Update browser tab title
  document.title = `${minutes}:${seconds.toString().padStart(2, "0")} - Simple Focus`;
  
  // Set original duration for progress calculation
  if (originalDuration === 0) {
    originalDuration = remainingSeconds;
  }
}

function updateSessionInfo(sessionType, sessionCount, cyclePosition) {
  const sessionTypes = {
    focus: "Focus Session",
    shortBreak: "Short Break",
    longBreak: "Long Break"
  };
  
  sessionTypeDisplay.textContent = sessionTypes[sessionType] || "Focus Session";
  
  if (sessionType === 'focus') {
    const focusSessionNumber = Math.floor(cyclePosition / 2) + 1;
    sessionCounter.textContent = `Session ${focusSessionNumber} of 4`;
  } else {
    sessionCounter.textContent = `Break Time`;
  }
}

function handleTimerFinished(message) {
  originalDuration = 0;
  
  // Create notification
  const sessionTypes = {
    focus: "Focus session complete! Time for a break.",
    shortBreak: "Break over! Ready for another focus session?",
    longBreak: "Long break complete! Great job on completing the cycle!"
  };
  
  chrome.notifications.create({
    type: "basic",
    title: "Simple Focus Mode",
    message: sessionTypes[message.sessionType] || "Session complete!",
    iconUrl: "../icons/icon48.png",
  });

  // Play sound
  const audio = new Audio(chrome.runtime.getURL('../clock_alarm.mp3'));
  audio.play();
  
  // Reset browser tab title
  document.title = "Simple Focus Mode";
}


