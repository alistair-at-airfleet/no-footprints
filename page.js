(function () {
  var TAG = '[MuteMarketing/PAGE]';

  function post(type, payload) {
    try { window.postMessage(Object.assign({ type }, payload || {}), '*'); } catch(_) {}
  }
  function log()  { try { console.log.apply(console,  [TAG].concat([].slice.call(arguments))); } catch(_) {} post('MM_LOG', { args: Array.from(arguments) }); }
  function info() { try { console.info.apply(console, [TAG].concat([].slice.call(arguments))); } catch(_) {} post('MM_LOG', { args: Array.from(arguments) }); }
  function warn() { try { console.warn.apply(console, [TAG].concat([].slice.call(arguments))); } catch(_) {} post('MM_LOG', { args: Array.from(arguments) }); }
  function err()  { try { console.error.apply(console,[TAG].concat([].slice.call(arguments))); } catch(_) {} post('MM_ERROR', { err: Array.from(arguments).join(' ') }); }

  // signal boot as early as possible
  window.MuteMarketingBooted = Date.now();
  info('Booting page.js at', new Date(window.MuteMarketingBooted).toISOString(), 'href=', location.href);
  post('MM_BOOTED', { ts: window.MuteMarketingBooted });

  // Ensure we’re top frame
  if (window.top !== window) {
    warn('Not top window → aborting to avoid sandboxed iframe issues.');
    return;
  }

  // ========== Config ==========
  var GA_IDS = ['G-52XWDYNNQW'];   // add any others
  var KEY   = 'employee';

  // ========== Global error piping (so you see if something blows up) ==========
  window.addEventListener('error', function (e) {
    err('window error:', e && (e.message || e.error && e.error.message), e && e.filename, e && e.lineno);
  });
  window.addEventListener('unhandledrejection', function (e) {
    err('unhandledrejection:', e && e.reason);
  });

  // ========== GA kill switch ==========
  try {
    GA_IDS.forEach(function (id) {
      window['ga-disable-' + id] = true;
      info('GA kill switch set for', id);
    });
  } catch (e) { err('kill switch failed', e); }

  // ========== Consent Mode ==========
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    var consent = {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      security_storage: 'granted'
    };
    window.gtag('consent', 'default', consent);
    info('Consent Mode default applied', consent);
  } catch (e) { err('consent failed', e); }

  // ========== Prerender detection ==========
  var nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || null;
  var prerendered = (document.visibilityState === 'prerender') || !!(nav && nav.activationStart > 0);
  info('visibilityState=', document.visibilityState, 'activationStart=', nav && nav.activationStart, 'prerendered=', prerendered);

  // ========== Storage helpers ==========
  function setAndVerifySession(k, v) {
    try { sessionStorage.setItem(k, v); var r = sessionStorage.getItem(k); info('sessionStorage', k, '→', r); return r === v; }
    catch (e) { warn('sessionStorage failed:', e && e.message); return false; }
  }
  function setAndVerifyLocal(k, v) {
    try { localStorage.setItem(k, v); var r = localStorage.getItem(k); info('localStorage', k, '→', r); return r === v; }
    catch (e) { warn('localStorage failed:', e && e.message); return false; }
  }
  function setAndVerifyCookie(k, v) {
    try {
      document.cookie = encodeURIComponent(k) + '=' + encodeURIComponent(v) + '; path=/; SameSite=Lax';
      var found = document.cookie.split(';').map(function(s){return s.trim();}).some(function(kv){return kv.indexOf(encodeURIComponent(k)+'=')===0;});
      info('cookie', k, '→', found ? 'present' : 'missing');
      return found;
    } catch (e) { warn('cookie failed:', e && e.message); return false; }
  }
  function setFlag() {
    info('Setting flag:', KEY);
    var okS = setAndVerifySession(KEY, 'true');
    var okL = setAndVerifyLocal(KEY, 'true');
    var okC = setAndVerifyCookie(KEY, '1');
    info('Storage results → session:', okS, '| local:', okL, '| cookie:', okC);
  }

  if (prerendered) {
    info('Deferring storage until activation via visibilitychange');
    document.addEventListener('visibilitychange', function onVis() {
      if (document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', onVis);
        setFlag();
      }
    }, { once: true });
  } else {
    setFlag();
  }

  // ========== GA4 debug markers ==========
  try {
    window.dataLayer.push({ debug_mode: true });
    info('Pushed dataLayer debug_mode');
    if (typeof window.gtag === 'function') {
      window.gtag('set', { debug_mode: true, allow_google_signals: false, ads_data_redaction: true });
      info('gtag debug_mode + signal redaction set.');
    } else {
      warn('gtag not present yet.');
    }
  } catch (e) { err('debug marker failed', e); }
})();
