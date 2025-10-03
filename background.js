chrome.runtime.onInstalled.addListener(async () => {
  const { extensionEnabled } = await chrome.storage.local.get('extensionEnabled');
  if (typeof extensionEnabled === 'undefined') {
    await chrome.storage.local.set({ extensionEnabled: true }); // or false, your choice
    console.log('[MuteMarketing/BG] initialized extensionEnabled=true');
  }
});
