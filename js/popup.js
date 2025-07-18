// DOM elements
const startPomodoroBtn = document.getElementById('start-pomodoro');
const startCustomBtn = document.getElementById('start-custom');
const startCustomTimerBtn = document.getElementById('start-custom-timer');
const pauseBtn = document.getElementById('pause-timer');
const resumeBtn = document.getElementById('resume-timer');
const stopBtn = document.getElementById('stop-timer');
const themeToggle = document.getElementById('theme-toggle');
const timerDisplay = document.getElementById('timer-display');
const timerSlider = document.getElementById('timer-slider');
const countdownDisplay = document.getElementById('countdown-display');
const sessionTypeDisplay = document.getElementById('session-type-display');
const sessionCounter = document.getElementById('session-counter');
const timerControls = document.getElementById('timer-controls');
const customTimerSection = document.getElementById('custom-timer-section');
const progressFill = document.getElementById('progress-fill');
const progressBar = document.getElementById('progress-bar');
const progressHandle = document.getElementById('progress-handle');
const cycleDots = document.querySelectorAll('.dot');
const modalOverlay = document.getElementById('modal-overlay');
const editorTitle = document.getElementById('editor-title');
const durationInput = document.getElementById('duration-input');
const editorSave = document.getElementById('editor-save');
const editorCancel = document.getElementById('editor-cancel');
const editorClose = document.getElementById('editor-close');
const helpIcon = document.getElementById('help-icon');
const aboutPage = document.getElementById('about-page');
const aboutClose = document.getElementById('about-close');

let originalDuration = 0;
let isDarkMode = false;
let isTimerRunning = false;
let isDragging = false;
let currentEditingDot = null;
let sessionDurations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15
};

// Load saved settings
chrome.storage.sync.get(['focusTimeSetting', 'darkMode', 'sessionDurations'], (data) => {
  if (data.focusTimeSetting) {
    timerDisplay.textContent = `${data.focusTimeSetting} min`;
    timerSlider.value = data.focusTimeSetting;
  }
  if (data.darkMode) {
    isDarkMode = data.darkMode;
    updateTheme();
  }
  if (data.sessionDurations) {
    sessionDurations = { ...sessionDurations, ...data.sessionDurations };
    // Update dot tooltips with saved durations
    cycleDots.forEach(dot => {
      const type = dot.dataset.type;
      const duration = sessionDurations[type];
      if (duration) {
        dot.dataset.duration = duration;
        dot.title = `${type === 'focus' ? 'Focus' : 
                     type === 'shortBreak' ? 'Break' : 'Long Break'}: ${duration} min`;
      }
    });
    // Update countdown display if not running
    if (!isTimerRunning) {
      resetUI();
    }
  }
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  updateTheme();
  chrome.storage.sync.set({ darkMode: isDarkMode });
});

function updateTheme() {
  document.body.classList.toggle('dark-mode', isDarkMode);
  themeToggle.textContent = isDarkMode ? '◑' : '◐';
}

// Timer slider
timerSlider.addEventListener('input', () => {
  const focusTime = timerSlider.value;
  timerDisplay.textContent = `${focusTime} min`;
  chrome.storage.sync.set({ focusTimeSetting: focusTime });
});

// Interactive progress bar
progressBar.addEventListener('click', (e) => {
  if (!isTimerRunning) return;
  
  const rect = progressBar.getBoundingClientRect();
  const percentage = (e.clientX - rect.left) / rect.width;
  const newRemainingTime = Math.floor(originalDuration * (1 - percentage));
  
  if (newRemainingTime > 0) {
    chrome.runtime.sendMessage({
      command: 'updateTimer',
      remainingSeconds: newRemainingTime
    });
  }
});

// Progress handle dragging
progressHandle.addEventListener('mousedown', (e) => {
  if (!isTimerRunning) return;
  
  e.preventDefault();
  isDragging = true;
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newRemainingTime = Math.floor(originalDuration * (1 - percentage));
    
    if (newRemainingTime > 0) {
      updateProgressBar(percentage * 100);
      updateCountdownDisplay(newRemainingTime);
    }
  };
  
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    
    const rect = progressBar.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newRemainingTime = Math.floor(originalDuration * (1 - percentage));
    
    if (newRemainingTime > 0) {
      chrome.runtime.sendMessage({
        command: 'updateTimer',
        remainingSeconds: newRemainingTime
      });
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

// Dot interactions
cycleDots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const type = dot.dataset.type;
    const duration = parseInt(dot.dataset.duration);
    
    if (isTimerRunning) {
      // Preview mode - show what's coming next
      showDotPreview(dot, type, duration);
    } else {
      // Edit mode - allow changing duration
      openDotEditor(dot, type, duration);
    }
  });
  
  dot.addEventListener('mouseenter', () => {
    if (isTimerRunning) {
      dot.classList.add('preview');
    } else {
      dot.classList.add('editing');
    }
  });
  
  dot.addEventListener('mouseleave', () => {
    dot.classList.remove('preview');
    // Only remove editing class if this dot is not actually being edited
    if (currentEditingDot !== dot) {
      dot.classList.remove('editing');
    }
  });
});

// Dot editor event listeners
editorSave.addEventListener('click', () => {
  saveDotDuration();
});

editorCancel.addEventListener('click', () => {
  closeDotEditor();
});

editorClose.addEventListener('click', () => {
  closeDotEditor();
});

// Help/About functionality
helpIcon.addEventListener('click', () => {
  aboutPage.classList.remove('hidden');
});

aboutClose.addEventListener('click', () => {
  aboutPage.classList.add('hidden');
});

// Close editor when clicking outside
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeDotEditor();
  }
});

// Button event listeners
startPomodoroBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'startPomodoroCycle' });
  showTimerControls();
});

startCustomBtn.addEventListener('click', () => {
  customTimerSection.classList.toggle('hidden');
});

startCustomTimerBtn.addEventListener('click', () => {
  const duration = parseInt(timerSlider.value);
  chrome.runtime.sendMessage({ command: 'startTimer', duration: duration });
  showTimerControls();
  customTimerSection.classList.add('hidden');
});

pauseBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'pauseTimer' });
  pauseBtn.classList.add('hidden');
  resumeBtn.classList.remove('hidden');
});

resumeBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'resumeTimer' });
  resumeBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'stopTimer' });
  hideTimerControls();
  resetUI();
});

function showTimerControls() {
  timerControls.classList.remove('hidden');
  startPomodoroBtn.classList.add('hidden');
  startCustomBtn.classList.add('hidden');
}

function hideTimerControls() {
  timerControls.classList.add('hidden');
  startPomodoroBtn.classList.remove('hidden');
  startCustomBtn.classList.remove('hidden');
  pauseBtn.classList.remove('hidden');
  resumeBtn.classList.add('hidden');
}

function resetUI() {
  const focusDuration = sessionDurations.focus;
  const minutes = Math.floor(focusDuration);
  const seconds = Math.floor((focusDuration - minutes) * 60);
  countdownDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  sessionTypeDisplay.textContent = 'Focus Session';
  sessionCounter.textContent = 'Focus 1 of 4';
  updateProgressBar(0);
  updateCycleDots(0);
  progressBar.classList.remove('timer-active');
  originalDuration = 0;
  isTimerRunning = false;
}

function updateProgressBar(percentage) {
  progressFill.style.width = `${percentage}%`;
  progressHandle.style.left = `${percentage}%`;
}

function updateCycleDots(position) {
  cycleDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === position);
    dot.classList.toggle('completed', index < position);
  });
}

// Get initial state
chrome.runtime.sendMessage({ command: 'requestCountdownState' }, (response) => {
  if (response && response.remainingSeconds !== null) {
    // Set original duration if timer is running
    if (originalDuration === 0 && response.remainingSeconds > 0) {
      originalDuration = response.remainingSeconds;
    }
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
  if (message.command === 'updateCountdown') {
    updateUI(message);
  } else if (message.command === 'timerFinished') {
    handleTimerFinished(message);
  }
});

function updateUI(data) {
  updateCountdownDisplay(data.remainingSeconds);
  updateSessionInfo(data.sessionType, data.sessionCount, data.cyclePosition);
  updateCycleDots(data.cyclePosition);
  
  // Update timer running state
  isTimerRunning = data.remainingSeconds > 0;
  
  // Update progress bar visual state
  progressBar.classList.toggle('timer-active', isTimerRunning);
  
  // Update progress bar
  if (originalDuration > 0 && data.remainingSeconds > 0) {
    const percentage = ((originalDuration - data.remainingSeconds) / originalDuration) * 100;
    updateProgressBar(Math.min(100, Math.max(0, percentage)));
  }
}

// Dot editing functions
function openDotEditor(dot, type, duration) {
  currentEditingDot = dot;
  
  // Update editor content
  const sessionName = type === 'focus' ? 'Focus Session' : 
                     type === 'shortBreak' ? 'Short Break' : 'Long Break';
  editorTitle.textContent = `Edit ${sessionName}`;
  durationInput.value = duration;
  
  // Show modal overlay
  modalOverlay.classList.remove('hidden');
  
  // Highlight editing dot
  dot.classList.add('editing');
  
  // Focus input
  setTimeout(() => durationInput.focus(), 100);
}

function closeDotEditor() {
  modalOverlay.classList.add('hidden');
  if (currentEditingDot) {
    currentEditingDot.classList.remove('editing');
    currentEditingDot = null;
  }
}

function saveDotDuration() {
  if (!currentEditingDot) return;
  
  const newDuration = parseInt(durationInput.value);
  if (newDuration < 1 || newDuration > 120) {
    alert('Duration must be between 1 and 120 minutes');
    return;
  }
  
  const type = currentEditingDot.dataset.type;
  
  // Update local storage
  sessionDurations[type] = newDuration;
  chrome.storage.sync.set({ sessionDurations });
  
  // Update dot display
  currentEditingDot.dataset.duration = newDuration;
  currentEditingDot.title = `${type === 'focus' ? 'Focus' : 
                             type === 'shortBreak' ? 'Break' : 'Long Break'}: ${newDuration} min`;
  
  // Update all dots of the same type
  cycleDots.forEach(dot => {
    if (dot.dataset.type === type) {
      dot.dataset.duration = newDuration;
      dot.title = `${type === 'focus' ? 'Focus' : 
                   type === 'shortBreak' ? 'Break' : 'Long Break'}: ${newDuration} min`;
    }
  });
  
  // Send to background script
  chrome.runtime.sendMessage({
    command: 'updateSessionDuration',
    sessionType: type,
    duration: newDuration
  });
  
  // Update countdown display if we're not running and this is a focus session
  if (!isTimerRunning && type === 'focus') {
    const minutes = Math.floor(newDuration);
    const seconds = Math.floor((newDuration - minutes) * 60);
    countdownDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  closeDotEditor();
}

function showDotPreview(dot, type, duration) {
  const sessionName = type === 'focus' ? 'Focus Session' : 
                     type === 'shortBreak' ? 'Short Break' : 'Long Break';
  
  // Update tooltip to show preview
  dot.title = `Next: ${sessionName} (${duration} min)`;
  
  // Brief highlight
  dot.classList.add('preview');
  setTimeout(() => dot.classList.remove('preview'), 1000);
}

function updateCountdownDisplay(remainingSeconds) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  countdownDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Update browser tab title
  document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Simple Focus`;
  
  // Set original duration for progress calculation
  if (originalDuration === 0) {
    originalDuration = remainingSeconds;
  }
}

function updateSessionInfo(sessionType, sessionCount, cyclePosition) {
  const sessionTypes = {
    focus: 'Focus Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };
  
  sessionTypeDisplay.textContent = sessionTypes[sessionType] || 'Focus Session';
  
  if (sessionType === 'focus') {
    const focusSessionNumber = Math.floor(cyclePosition / 2) + 1;
    sessionCounter.textContent = `Focus ${focusSessionNumber} of 4`;
  } else if (sessionType === 'longBreak') {
    sessionCounter.textContent = 'Long Break - Cycle Complete!';
  } else {
    sessionCounter.textContent = 'Short Break';
  }
}

function handleTimerFinished(message) {
  originalDuration = 0;
  
  // Create notification
  const sessionTypes = {
    focus: 'Focus session complete! Time for a break.',
    shortBreak: 'Break over! Ready for another focus session?',
    longBreak: 'Long break complete! Great job on completing the cycle!'
  };
  
  chrome.notifications.create({
    type: 'basic',
    title: 'Simple Focus Mode',
    message: sessionTypes[message.sessionType] || 'Session complete!',
    iconUrl: '../icons/icon48.png',
  });

  // Play sound
  const audio = new Audio(chrome.runtime.getURL('../clock_alarm.mp3'));
  audio.play();
  
  // Reset browser tab title
  document.title = 'Simple Focus Mode';
}


