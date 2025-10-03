chrome.storage.local.get('extensionEnabled', ({ extensionEnabled }) => {
  if (!extensionEnabled) return;
  if (!location.hostname.endsWith('rsaweb.co.za')) return;

  sessionStorage.setItem('employee', 'true');

  const code = `
    (function () {
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ debug_mode: true });

        if (typeof window.gtag === 'function') {
          window.gtag('set', { debug_mode: true });

          window.gtag('set', {
            allow_google_signals: false,   // turns off Google Signals
            ads_data_redaction: true       // redacts ad-click identifiers
          });
        }
      } catch (e) {}
    })();
  `;
  const s = document.createElement('script');
  s.textContent = code;
  (document.documentElement || document.head || document.body).appendChild(s);
  s.remove();
});
