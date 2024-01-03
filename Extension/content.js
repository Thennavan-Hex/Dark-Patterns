document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
      const url = event.target.href;
      sendUrlToBackground(url);
    }
  });
  
  function sendUrlToBackground(url) {
    chrome.runtime.sendMessage({ action: 'captureUrl', url: url }, function(response) {
      console.log('URL sent to background script:', url);
    });
  }
  