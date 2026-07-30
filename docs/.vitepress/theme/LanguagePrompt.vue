<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';

type Locale = 'zh' | 'en';

const LOCALE_KEY = 'firefly.locale';
const PROMPT_KEY = 'firefly.locale.prompted';
const activeLocale = ref<Locale>('zh');
const visible = ref(false);

const copy = computed(() => activeLocale.value === 'zh'
  ? {
      title: '已为你显示中文',
      detail: '语言来自浏览器设置，你可以随时切换。',
      switchLabel: 'English',
      keepLabel: '保持中文',
      closeLabel: '关闭语言提示'
    }
  : {
      title: 'Showing this page in English',
      detail: 'This follows your browser settings. You can switch anytime.',
      switchLabel: '中文',
      keepLabel: 'Keep English',
      closeLabel: 'Dismiss language prompt'
    });

function readStoredValue(key: string): string | null {
  for (const storageName of ['localStorage', 'sessionStorage'] as const) {
    try {
      const storage = window[storageName];
      const value = storage.getItem(key);
      if (value !== null) return value;
    } catch {
      // Continue with the next available browser storage.
    }
  }
  return null;
}

function storeValue(key: string, value: string): void {
  for (const storageName of ['localStorage', 'sessionStorage'] as const) {
    try {
      const storage = window[storageName];
      storage.setItem(key, value);
    } catch {
      // The current session still works when browser storage is unavailable.
    }
  }
}

function storedLocale(): Locale | null {
  const value = readStoredValue(LOCALE_KEY);
  return value === 'zh' || value === 'en' ? value : null;
}

function detectBrowserLocale(): Locale {
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const language of languages) {
    const normalized = String(language || '').toLowerCase();
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('en')) return 'en';
  }
  return 'en';
}

function relativePath(pathname: string): string {
  const base = withBase('/').replace(/\/$/, '');
  const path = base && pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname;
  return path.replace(/^\/+/, '');
}

function localeFromPath(pathname: string): Locale {
  const path = relativePath(pathname);
  return path === 'en' || path.startsWith('en/') ? 'en' : 'zh';
}

function localizedUrl(locale: Locale): string {
  const path = relativePath(window.location.pathname);
  const currentLocale = localeFromPath(window.location.pathname);
  const contentPath = currentLocale === 'en'
    ? path.replace(/^en(?:\/|$)/, '')
    : path;
  const localizedPath = locale === 'en' ? `en/${contentPath}` : contentPath;
  return `${withBase(`/${localizedPath}`)}${window.location.search}${window.location.hash}`;
}

function rememberLocale(locale: Locale, prompted: boolean): void {
  storeValue(LOCALE_KEY, locale);
  if (prompted) storeValue(PROMPT_KEY, '1');
}

function chooseLocale(locale: Locale): void {
  rememberLocale(locale, true);
  visible.value = false;
  if (locale !== activeLocale.value) window.location.assign(localizedUrl(locale));
}

function dismissPrompt(): void {
  rememberLocale(activeLocale.value, true);
  visible.value = false;
}

function rememberNavigationChoice(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return;
  const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!anchor?.closest('.VPNavBarTranslations, .VPNavScreenTranslations')) return;

  const url = new URL(anchor.href, window.location.href);
  rememberLocale(localeFromPath(url.pathname), true);
}

onMounted(() => {
  document.addEventListener('click', rememberNavigationChoice, true);

  const currentLocale = localeFromPath(window.location.pathname);
  const preferredLocale = storedLocale() || detectBrowserLocale();
  rememberLocale(preferredLocale, false);

  if (currentLocale !== preferredLocale) {
    window.location.replace(localizedUrl(preferredLocale));
    return;
  }

  activeLocale.value = currentLocale;
  visible.value = readStoredValue(PROMPT_KEY) !== '1';
});

onBeforeUnmount(() => {
  document.removeEventListener('click', rememberNavigationChoice, true);
});
</script>

<template>
  <Transition name="ff-language-prompt">
    <aside
      v-if="visible"
      class="ff-language-prompt"
      role="status"
      aria-live="polite"
    >
      <div class="ff-language-prompt__mark" aria-hidden="true">
        <span :class="{ active: activeLocale === 'zh' }">ZH</span>
        <i />
        <span :class="{ active: activeLocale === 'en' }">EN</span>
      </div>

      <div class="ff-language-prompt__copy">
        <strong>{{ copy.title }}</strong>
        <span>{{ copy.detail }}</span>
      </div>

      <div class="ff-language-prompt__actions">
        <button class="primary" type="button" @click="chooseLocale(activeLocale === 'zh' ? 'en' : 'zh')">
          {{ copy.switchLabel }}
        </button>
        <button type="button" @click="chooseLocale(activeLocale)">
          {{ copy.keepLabel }}
        </button>
      </div>

      <button
        class="ff-language-prompt__close"
        type="button"
        :aria-label="copy.closeLabel"
        :title="copy.closeLabel"
        @click="dismissPrompt"
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  </Transition>
</template>
