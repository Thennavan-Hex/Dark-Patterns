chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let currentTab = tabs[0];
        if (currentTab && currentTab.url) {
          sendUrlToServer(currentTab.url);
        }
      });
    }
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'captureUrl' && request.url) {
      sendUrlToServer(request.url);
    }
  });
  
  function sendUrlToServer(url) {
    fetch('http://localhost:3000/api/store-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('URL sent to server:', data);
    })
    .catch(error => {
      console.error('Error sending URL to server:', error);
    });
  }
  