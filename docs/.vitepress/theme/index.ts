import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import LanguagePrompt from './LanguagePrompt.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-bottom': () => h(LanguagePrompt)
  })
};
