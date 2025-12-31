document.addEventListener('DOMContentLoaded', () => {
  loadIgnoredWebsites();

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', saveIgnoredWebsites);

  checkAICapabilities();
});

async function checkAICapabilities() {
  const statusElement = document.getElementById('ai-status');
  if (!window.ai || !window.ai.languageModel) {
    statusElement.textContent = 'Not Available (API not found)';
    statusElement.className = 'status-value error';
    return;
  }

  try {
    const capabilities = await window.ai.languageModel.capabilities();
    if (capabilities.available === 'readily') {
      statusElement.textContent = 'Available (Ready)';
      statusElement.className = 'status-value success';
    } else if (capabilities.available === 'after-download') {
      statusElement.textContent = 'Available (Needs Download)';
      statusElement.className = 'status-value warning';
    } else {
      statusElement.textContent = 'Not Available';
      statusElement.className = 'status-value error';
    }
  } catch (e) {
    statusElement.textContent = 'Error Checking status';
    statusElement.className = 'status-value error';
    console.error(e);
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

