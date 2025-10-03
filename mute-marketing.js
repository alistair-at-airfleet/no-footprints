(function () {
  const TAG = '[MuteMarketing/CS]';

  // Make sure on the right host early
  if (!location.hostname.endsWith('rsaweb.co.za')) {
    console.debug(TAG, 'Skipping: host mismatch →', location.hostname);
    return;
  }

  console.debug(TAG, 'Boot at', performance.now(), 'run_at=document_start');

  chrome.storage.local.get('extensionEnabled', ({ extensionEnabled }) => {
    console.debug(TAG, 'extensionEnabled =', extensionEnabled);

    if (!extensionEnabled) return;

    // Listen for handshake from page.js
    window.addEventListener('message', (evt) => {
      if (!evt || !evt.data || evt.source !== window) return;
      if (evt.data.type === 'MM_BOOTED') {
        console.info(TAG, 'Handshake: page.js BOOTED at', new Date(evt.data.ts).toISOString());
      }
      if (evt.data.type === 'MM_ERROR') {
        console.error(TAG, 'page.js error:', evt.data.err);
      }
      if (evt.data.type === 'MM_LOG') {
        console.log('[MuteMarketing/PAGE]', ...evt.data.args);
      }
    });

    // Inject page.js as an external file (CSP-friendly)
    const url = chrome.runtime.getURL('page.js');
    const s = document.createElement('script');
    s.src = url;
    s.async = false;

    s.onload = () => {
      console.info(TAG, 'Injected page.js OK →', url);
    };
    s.onerror = (e) => {
      console.error(TAG, 'FAILED to inject page.js →', url, e);
      console.warn(TAG, 'If CSP blocks extension URLs, use scripting API world: "MAIN".');
    };

    (document.documentElement || document.head || document.body).appendChild(s);
    // removing the node does not stop execution; but keep it for cleanliness
    s.remove();
  });
})();
