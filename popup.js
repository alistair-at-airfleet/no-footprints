const toggle = document.getElementById('toggle');

chrome.storage.sync.get(['enabled'], (data) => {
  toggle.checked = data.enabled || true; // Set default to true
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});