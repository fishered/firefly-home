import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Firefly',
  description: 'A lightweight Java 21 scheduling service for reliable task orchestration.',
  lang: 'zh-CN',
  base: process.env.VITEPRESS_BASE ?? '/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#101820' }],
    ['link', { rel: 'icon', href: '/firefly-mark.svg', type: 'image/svg+xml' }]
  ],
  themeConfig: {
    logo: '/firefly-mark.svg',
    siteTitle: 'Firefly',
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/quick-start' },
      { text: '文档', link: '/guide/integration' },
      { text: 'API', link: '/reference/admin-api' },
      { text: '对比', link: '/comparison' },
      { text: 'GitHub', link: 'https://github.com/fishered/Firefly' }
    ],
    sidebar: [
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
          { text: 'Admin API', link: '/reference/admin-api' },
          { text: 'Metrics 指标', link: '/reference/metrics' },
          { text: '数据库结构', link: '/reference/database-schema' },
          { text: '同类产品对比', link: '/comparison' },
          { text: '选用优势', link: '/why-firefly' }
        ]
      },
      {
        text: '社区',
        items: [
          { text: '提交需求', link: '/community/requirements' },
          { text: '路线图', link: '/community/roadmap' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fishered/Firefly' }
    ],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2026 Firefly'
    },
    editLink: {
      pattern: 'https://github.com/fishered/Firefly/edit/main/docs/:path',
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
    returnToTopLabel: '回到顶部'
  }
});
