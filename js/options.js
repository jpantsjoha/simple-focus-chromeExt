document.addEventListener('DOMContentLoaded', () => {
  loadIgnoredWebsites();

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', saveIgnoredWebsites);

  checkAICapabilities();
});

async function checkAICapabilities() {
  const statusElement = document.getElementById('ai-status');

  // 1. Basic API Presence Check
  if (!window.ai) {
    statusElement.textContent = 'Not Available (window.ai missing)';
    statusElement.className = 'status-value error';
    return;
  }

  // 2. Language Model API Check
  if (!window.ai.languageModel) {
    statusElement.textContent = 'Not Available (ai.languageModel missing - Enable in chrome://flags)';
    statusElement.className = 'status-value error';
    return;
  }

  try {
    // 3. Capabilities Check
    const capabilities = await window.ai.languageModel.capabilities();

    if (capabilities.available === 'readily') {
      statusElement.textContent = 'Available (On-Device)';
      statusElement.className = 'status-value success';
    } else if (capabilities.available === 'after-download') {
      statusElement.textContent = 'Available (Needs Download)';
      statusElement.className = 'status-value warning';
    } else {
      statusElement.textContent = 'Not Available (Capability: ' + capabilities.available + ')';
      statusElement.className = 'status-value error';
    }
  } catch (e) {
    statusElement.textContent = 'Error: ' + e.message;
    statusElement.className = 'status-value error';
    console.error('AI Check failed:', e);
  }
}

function loadIgnoredWebsites() {
  chrome.storage.sync.get('ignoredWebsites', (data) => {
    const ignoredWebsitesTextarea = document.getElementById('ignored-websites');
    ignoredWebsitesTextarea.value = data.ignoredWebsites.join('\n');
  });
}

function saveIgnoredWebsites() {
  const ignoredWebsitesTextarea = document.getElementById('ignored-websites');
  const ignoredWebsites = ignoredWebsitesTextarea.value
    .split('\n')
    .map(website => website.trim())
    .filter(website => website.length > 0);

  chrome.storage.sync.set({ ignoredWebsites }, () => {
    alert('Ignored websites saved successfully!');
  });
}

