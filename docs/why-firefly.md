---
title: 选用优势
description: Firefly 适合哪些团队和系统。
---

# 选用优势

Firefly 适合希望“调度语义清楚、系统边界轻、运维入口独立”的 Java 团队。

## 时间正确性

很多调度问题不是 cron 写错，而是默认时区、DST、部署机器配置和运行态游标混在一起。Firefly 要求任务显式声明 IANA `ZoneId`，运行态统一使用 UTC `Instant`。

## 核心轻量

`scheduler-core` 保持纯 Java。它可以被嵌入业务进程，也可以由独立 Server 承载。HTTP、JDBC、Netty、Prometheus 都在 core 之外。

## 模块可替换

Firefly 按能力边界组织模块：

- `integrations/*` 负责框架接入
- `stores/*` 负责持久化
- `transports/*` 负责远程执行器通信
- `apis/*` 负责管理 API
- `plugins/*` 负责可选能力

## 运维友好

Admin UI 和 Admin HTTP API 分离。Java API 节点只返回 JSON，Node Admin UI 负责页面、会话和代理。Prometheus 插件独立暴露 `/metrics`。

## 渐进演进

Firefly 可以先从内存调度器开始，再接 H2，本地跑通后切 PostgreSQL/MySQL，最后拆分 api、gateway、scheduler 节点。

## 不适合的场景

Firefly 不是大型 DAG 工作流系统，也不是数据编排平台。如果你的核心需求是复杂依赖图、数据集血缘、人工审批流或跨系统补数编排，工作流引擎可能更合适。
