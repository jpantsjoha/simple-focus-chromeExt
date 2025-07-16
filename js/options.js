document.addEventListener('DOMContentLoaded', () => {
    loadIgnoredWebsites();
  
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', saveIgnoredWebsites);
    
  });
  
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

