import { defineConfig, type DefaultTheme } from 'vitepress';

const base = process.env.VITEPRESS_BASE ?? '/';
const asset = (path: string) => `${base}${path}`.replace(/\/{2,}/g, '/');
const siteRepo = 'https://github.com/fishered/firefly-home';
const productRepo = 'https://github.com/fishered/Firefly';
const mavenCentral = 'https://central.sonatype.com/artifact/io.github.fishered/firefly-spring-boot-starter/1.0.8';
const releaseVersions = ['v1.0.8', 'v1.0.6', 'v1.0.5', 'v1.0.4', 'v1.0.3', 'v1.0.2', 'v1.0.1'];

const releaseItems = (localePrefix: string, moreText: string) => {
  const items = releaseVersions.slice(0, 3).map((version) => ({
    text: version,
    link: `${localePrefix}/releases/${version}`
  }));
  if (releaseVersions.length > 3) {
    items.push({ text: moreText, link: `${localePrefix}/releases/` });
  }
  return items;
};

const sharedTheme: DefaultTheme.Config = {
  logo: '/firefly-mark.svg',
  siteTitle: 'Firefly',
  socialLinks: [
    { icon: 'github', link: productRepo }
  ],
  search: {
    provider: 'local'
  },
  footer: {
    message: 'Released under the Apache-2.0 License.',
    copyright: 'Copyright © 2026 Firefly'
  },
  outline: {
    level: [2, 3]
  }
};

const zhNav: DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  { text: '快速开始', link: '/guide/quick-start' },
  { text: '文档', link: '/guide/integration' },
  { text: 'API', link: '/reference/admin-api' },
  {
    text: 'Release Note',
    items: releaseItems('', '查看更多...')
  },
  { text: '对比', link: '/comparison' },
  { text: 'Maven Central', link: mavenCentral },
  { text: 'GitHub', link: productRepo }
];

const enNav: DefaultTheme.NavItem[] = [
  { text: 'Home', link: '/en/' },
  { text: 'Quick Start', link: '/en/guide/quick-start' },
  { text: 'Docs', link: '/en/guide/integration' },
  { text: 'API', link: '/en/reference/admin-api' },
  {
    text: 'Release Note',
    items: releaseItems('/en', 'More...')
  },
  { text: 'Comparison', link: '/en/comparison' },
  { text: 'Maven Central', link: mavenCentral },
  { text: 'GitHub', link: productRepo }
];

const zhSidebar: DefaultTheme.Sidebar = [
  {
    text: '开始使用',
    items: [
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '集成方式', link: '/guide/integration' },
      { text: '部署说明', link: '/guide/deployment' },
      { text: '配置参考', link: '/reference/configuration' }
    ]
  },
  {
    text: '技术组件',
    items: [
      { text: '组件总览', link: '/features/' },
      { text: '调度核心', link: '/features/scheduler-core' },
      { text: '调度中心模型', link: '/features/scheduler-center' },
      { text: 'Netty 执行器', link: '/features/netty-executor' },
      { text: 'JDBC 与 HA', link: '/features/ha-cluster' },
      { text: '插件体系', link: '/features/plugins' }
    ]
  },
  {
    text: '参考文档',
    items: [
      { text: 'Maven Central', link: '/reference/maven-central' },
      { text: 'Admin API', link: '/reference/admin-api' },
      { text: 'Metrics 指标', link: '/reference/metrics' },
      { text: '数据库结构', link: '/reference/database-schema' },
      { text: '同类产品对比', link: '/comparison' },
      { text: '选用优势', link: '/why-firefly' }
    ]
  },
  {
    text: 'Release Note',
    items: releaseItems('', '查看更多...')
  },
  {
    text: '社区',
    items: [
      { text: '提交需求', link: '/community/requirements' },
      { text: '路线图', link: '/community/roadmap' }
    ]
  }
];

const enSidebar: DefaultTheme.Sidebar = [
  {
    text: 'Get Started',
    items: [
      { text: 'Quick Start', link: '/en/guide/quick-start' },
      { text: 'Integration', link: '/en/guide/integration' },
      { text: 'Deployment', link: '/en/guide/deployment' },
      { text: 'Configuration', link: '/en/reference/configuration' }
    ]
  },
  {
    text: 'Technical Components',
    items: [
      { text: 'Overview', link: '/en/features/' },
      { text: 'Scheduler Core', link: '/en/features/scheduler-core' },
      { text: 'Scheduler Center', link: '/en/features/scheduler-center' },
      { text: 'Netty Executor', link: '/en/features/netty-executor' },
      { text: 'JDBC and HA', link: '/en/features/ha-cluster' },
      { text: 'Plugin System', link: '/en/features/plugins' }
    ]
  },
  {
    text: 'Reference',
    items: [
      { text: 'Maven Central', link: '/en/reference/maven-central' },
      { text: 'Admin API', link: '/en/reference/admin-api' },
      { text: 'Metrics', link: '/en/reference/metrics' },
      { text: 'Database Schema', link: '/en/reference/database-schema' },
      { text: 'Comparison', link: '/en/comparison' },
      { text: 'Why Firefly', link: '/en/why-firefly' }
    ]
  },
  {
    text: 'Release Note',
    items: releaseItems('/en', 'More...')
  },
  {
    text: 'Community',
    items: [
      { text: 'Submit Requests', link: '/en/community/requirements' },
      { text: 'Roadmap', link: '/en/community/roadmap' }
    ]
  }
];

export default defineConfig({
  title: 'Firefly',
  description: 'A lightweight Java 21 scheduling service for reliable task orchestration.',
  lang: 'zh-CN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#172033' }],
    ['link', { rel: 'icon', href: asset('favicon.svg'), type: 'image/svg+xml' }],
    ['script', { src: asset('language-bootstrap.js') }]
  ],
  themeConfig: {
    ...sharedTheme,
    nav: zhNav,
    sidebar: zhSidebar,
    editLink: {
      pattern: `${siteRepo}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页'
    },
    lastUpdatedText: '最近更新',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '本页目录',
      level: [2, 3]
    },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '语言'
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'Firefly',
      description: '轻量级 Java 21 定时调度服务',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Firefly',
      description: 'A lightweight Java 21 scheduling service for reliable task orchestration.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        editLink: {
          pattern: `${siteRepo}/edit/main/docs/:path`,
          text: 'Edit this page on GitHub'
        },
        lastUpdatedText: 'Last updated',
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        outline: {
          label: 'On this page',
          level: [2, 3]
        },
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Language'
      }
    }
  }
});
