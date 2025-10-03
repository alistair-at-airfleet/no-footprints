(function () {
  try {
    ['G-52XWDYNNQW'].forEach(id => { window['ga-disable-' + id] = true; });
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      security_storage: 'granted'
    });
    try { sessionStorage.setItem('employee', 'true'); } catch(_) {}
    window.dataLayer.push({ debug_mode: true });
    if (typeof window.gtag === 'function') {
      window.gtag('set', { debug_mode: true, allow_google_signals: false, ads_data_redaction: true });
    }
  } catch (e) { /* no-op */ }
})();
