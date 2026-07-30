(() => {
  const LOCALE_KEY = 'firefly.locale';
  const script = document.currentScript;
  const scriptPath = script ? new URL(script.src).pathname : '/language-bootstrap.js';
  const suffix = '/language-bootstrap.js';
  const base = scriptPath.endsWith(suffix)
    ? scriptPath.slice(0, -suffix.length)
    : '';

  const readPreference = () => {
    for (const storageName of ['localStorage', 'sessionStorage']) {
      try {
        const storage = window[storageName];
        const value = storage.getItem(LOCALE_KEY);
        if (value === 'zh' || value === 'en') return value;
      } catch {
        // Continue with the next available browser storage.
      }
    }
    return null;
  };

  const savePreference = (locale) => {
    for (const storageName of ['localStorage', 'sessionStorage']) {
      try {
        const storage = window[storageName];
        storage.setItem(LOCALE_KEY, locale);
      } catch {
        // Language detection still works when browser storage is unavailable.
      }
    }
  };

  const detectBrowserLocale = () => {
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];

    for (const language of languages) {
      const normalized = String(language || '').toLowerCase();
      if (normalized.startsWith('zh')) return 'zh';
      if (normalized.startsWith('en')) return 'en';
    }
    return 'en';
  };

  const relativePath = location.pathname.startsWith(base)
    ? location.pathname.slice(base.length).replace(/^\/+/, '')
    : location.pathname.replace(/^\/+/, '');
  const currentLocale = relativePath === 'en' || relativePath.startsWith('en/')
    ? 'en'
    : 'zh';
  const preferredLocale = readPreference() || detectBrowserLocale();

  savePreference(preferredLocale);
  if (currentLocale === preferredLocale) return;

  const contentPath = currentLocale === 'en'
    ? relativePath.replace(/^en(?:\/|$)/, '')
    : relativePath;
  const localizedPath = preferredLocale === 'en'
    ? `en/${contentPath}`
    : contentPath;
  const targetPath = `${base}/${localizedPath}`.replace(/\/{2,}/g, '/');

  location.replace(`${targetPath}${location.search}${location.hash}`);
})();
