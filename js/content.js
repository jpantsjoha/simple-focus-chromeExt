chrome.storage.sync.get("ignoredWebsites", (data) => {
    const currentURL = window.location.hostname;
  
    if (data.ignoredWebsites && data.ignoredWebsites.includes(currentURL)) {
      // Disable alerts and notifications from the current website
      window.alert = () => {};
      const oldNotification = window.Notification;
      window.Notification = function () {
        return new oldNotification("Silent Notification", {
          silent: true,
        });
      };
    }
  });
  