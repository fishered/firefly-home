---
title: 同类产品对比
description: Firefly、Quartz、XXL-JOB、PowerJob、ElasticJob 和工作流系统的选型差异。
---

# 同类产品对比

这份对比用于帮助选型，不是胜负表。不同产品的成熟度、生态和目标场景不同，Firefly 的定位是轻量 Java 调度服务和可演进调度中心。

| 产品类型 | 代表 | 更适合 | Firefly 的差异 |
|---|---|---|---|
| 进程内调度库 | Quartz | 单应用内复杂调度 | Firefly core 更克制，同时保留向独立 Server 和远程 Executor 演进的路径 |
| 调度平台 | XXL-JOB | 成熟的中心化任务管理和控制台 | Firefly 更强调 Java 21、任务级时区、模块边界和 JDBC HA 语义 |
| 分布式任务调度 | PowerJob | MapReduce、工作流、在线日志等平台能力 | Firefly 聚焦轻量调度中心和执行器路由，不做大而全平台 |
| 分片调度 | ElasticJob | 数据分片、作业分片和注册中心协同 | Firefly 使用 JDBC shard lease 和 fencing token 管理 scheduler ownership |
| 工作流编排 | Airflow、DolphinScheduler | DAG、数据编排、补数、依赖调度 | Firefly 不要求把任务建模成 DAG，适合业务服务里的定时任务治理 |

## 选择 Firefly 的信号

- 业务是 Java 技术栈，希望调度核心足够轻
- 任务时间语义很重要，尤其涉及跨时区或 DST
- 需要统一控制台和 API 管理任务，但不想引入大型工作流平台
- 希望业务服务通过主动连接接收任务
- 希望 Admin API、UI、Metrics、transport 都能独立演进

## 选择其他系统的信号

- 已经大量依赖成熟生态和现成控制台能力
- 需要复杂 DAG、数据集依赖、补数和任务血缘
- 需要非常丰富的任务平台能力，例如文件管理、日志采集、脚本执行和权限体系
- 团队更看重长期社区成熟度，而不是轻量可控的代码边界
