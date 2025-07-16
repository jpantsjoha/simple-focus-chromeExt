let startTime;
let endTime;
let countdownInterval = null;
let countdownState = {
  remainingSeconds: null,
  isActive: false,
  isPaused: false,
  sessionType: 'focus', // 'focus', 'shortBreak', 'longBreak'
  sessionCount: 0,
  cyclePosition: 0, // 0-7 (4 focus + 3 short breaks + 1 long break)
};

function startNextSession() {
  const sessionDurations = {
    focus: 25, // 25 minutes
    shortBreak: 5, // 5 minutes
    longBreak: 15 // 15 minutes
  };
  
  // Determine session type based on cycle position
  if (countdownState.cyclePosition === 7) {
    // Long break after 4 pomodoros
    countdownState.sessionType = 'longBreak';
  } else if (countdownState.cyclePosition % 2 === 1) {
    // Short break after odd positions (1, 3, 5)
    countdownState.sessionType = 'shortBreak';
  } else {
    // Focus session at even positions (0, 2, 4, 6)
    countdownState.sessionType = 'focus';
  }
  
  const duration = sessionDurations[countdownState.sessionType] * 60;
  startTimer(duration);
}

function startTimer(duration) {
  startTime = new Date().getTime();
  endTime = startTime + duration * 1000;
  countdownState.isActive = true;
  countdownState.isPaused = false;
  clearInterval(countdownInterval);
  
  // Enable website blocking for focus sessions
  try {
    if (countdownState.sessionType === 'focus') {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['rules']
      });
    } else {
      chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['rules']
      });
    }
  } catch (error) {
    console.error('Error updating ruleset:', error);
  }

  countdownInterval = setInterval(() => {
    if (countdownState.isPaused) return;
    
    const currentTime = new Date().getTime();
    const remainingSeconds = Math.round((endTime - currentTime) / 1000);

    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      countdownState.remainingSeconds = null;
      countdownState.isActive = false;
      
      // Update session counts
      if (countdownState.sessionType === 'focus') {
        countdownState.sessionCount++;
      }
      
      // Move to next cycle position
      countdownState.cyclePosition = (countdownState.cyclePosition + 1) % 8;
      
      // Send completion message
      chrome.runtime.sendMessage({ 
        command: "timerFinished",
        sessionType: countdownState.sessionType,
        sessionCount: countdownState.sessionCount,
        cyclePosition: countdownState.cyclePosition
      });
      
      // Auto-start next session (can be made optional)
      setTimeout(() => {
        startNextSession();
      }, 2000);
      
    } else {
      countdownState.remainingSeconds = remainingSeconds;
      chrome.runtime.sendMessage({
        command: "updateCountdown",
        remainingSeconds: remainingSeconds,
        sessionType: countdownState.sessionType,
        sessionCount: countdownState.sessionCount,
        cyclePosition: countdownState.cyclePosition
      });
    }
  }, 1000);
}

function pauseTimer() {
  countdownState.isPaused = true;
}

function resumeTimer() {
  if (countdownState.isPaused) {
    countdownState.isPaused = false;
    // Recalculate end time based on remaining seconds
    const currentTime = new Date().getTime();
    endTime = currentTime + countdownState.remainingSeconds * 1000;
  }
}

function stopTimer() {
  clearInterval(countdownInterval);
  countdownState.remainingSeconds = null;
  countdownState.isActive = false;
  countdownState.isPaused = false;
  
  // Disable website blocking
  try {
    chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ['rules']
    });
  } catch (error) {
    console.error('Error disabling ruleset:', error);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    try {
      if (message.command === "startTimer") {
          const duration = message.duration * 60; // Convert minutes to seconds
          startTimer(duration);
          sendResponse({ success: true });
        } else if (message.command === "startPomodoroCycle") {
          // Reset cycle and start first focus session
          countdownState.sessionCount = 0;
          countdownState.cyclePosition = 0;
          countdownState.sessionType = 'focus';
          startNextSession();
          sendResponse({ success: true });
        } else if (message.command === "pauseTimer") {
          pauseTimer();
          sendResponse({ success: true });
        } else if (message.command === "resumeTimer") {
          resumeTimer();
          sendResponse({ success: true });
        } else if (message.command === "stopTimer") {
          stopTimer();
          sendResponse({ success: true });
        } else if (message.command === "requestCountdownState") {
          sendResponse(countdownState);
        } else {
        // Catch-all for any other messages
        sendResponse({ received: true });
        }
    } catch (error) {
      console.error('Background script error:', error);
      sendResponse({ success: false, error: error.message });
    }
    
    // Return true to indicate we will send a response asynchronously
    return true;
  });
    