chrome.storage.local.get('extensionEnabled', function(data) {
  if (data.extensionEnabled) {
    // Your existing code to run when extension is enabled
    if (window.location.href.includes('augury.com')) {
      sessionStorage.setItem('afFootprint', 'true');
    }
  }
});
