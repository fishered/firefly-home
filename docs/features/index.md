---
title: 技术组件
description: Firefly 的 core、store、transport、API 和 plugin 组件。
---

# 技术组件

Firefly 的核心设计不是把所有能力堆进一个 server，而是把调度语义、持久化、执行器通信、运维 API 和插件生命周期拆开。

| 组件 | 模块 | 职责 |
|---|---|---|
| 调度核心 | `libs/scheduler-core` | cron/fixed-rate、时区、misfire、并发策略、任务执行 |
| Admin 模型 | `apis/admin-model` | Admin DTO 和视图模型 |
| Admin HTTP | `apis/admin-http` | JSON 管理 API、认证、RBAC、审计 |
| JDBC Store | `stores/jdbc` | 任务、节点、lease、execution、outbox 和审计持久化 |
| Netty Transport | `transports/netty` | 远程执行器注册、心跳、触发、ACK 和结果回传 |
| Plugin API | `plugins/plugin-api` | 可选能力的生命周期、配置读取和状态展示 |
| Metrics | `plugins/metrics-prometheus` | Prometheus 文本指标 |
| Admin UI | `ui/admin` | 独立 Node 控制台，代理浏览器侧 `/api/*` |

## 推荐阅读

- [调度核心](./scheduler-core)
- [调度中心模型](./scheduler-center)
- [Netty 执行器](./netty-executor)
- [JDBC 与 HA](./ha-cluster)
- [插件体系](./plugins)
