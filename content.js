chrome.storage.local.get('extensionEnabled', ({ extensionEnabled }) => {
  if (!extensionEnabled) return;
  if (!location.hostname.endsWith('rsaweb.co.za')) return;
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('page.js');
  s.async = false;                  
  (document.documentElement || document.head).appendChild(s);
  s.remove();
});





chrome.storage.local.get('extensionEnabled', ({ extensionEnabled }) => {
  if (!extensionEnabled) return;
  if (!location.hostname.endsWith('rsaweb.co.za')) return;

  const gtag = ['G-52XWDYNNQW'];
  const code = `
    (function () {
      try {
        var ga4Ids = ${JSON.stringify(gtag)};
        for (var i = 0; i < ga4Ids.length; i++) {
          window['ga-disable-' + ga4Ids[i]] = true;
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ debug_mode: true });

        if (typeof window.gtag === 'function') {
          window.gtag('set', { debug_mode: true });
          window.gtag('set', { allow_google_signals: false, ads_data_redaction: true });
        }
        try { sessionStorage.setItem('employee', 'true'); } catch (_) {}
      } catch (e) {}
    })();
  `;

  const s = document.createElement('script');
  s.textContent = code;
  (document.documentElement || document.head || document.body).appendChild(s);
  s.remove();
});