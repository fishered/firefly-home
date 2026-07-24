---
title: 调度中心模型
description: 任务、任务组、执行器、实例和运行态状态的关系。
---

# 调度中心模型

Firefly 调度中心围绕四个配置实体和一组运行态数据组织。

```text
JobDefinition -> JobGroupDefinition -> ExecutorDefinition -> ExecutorInstance
```

## 配置数据

| 模型 | 说明 |
|---|---|
| `ExecutorDefinition` | 逻辑执行器定义，例如 `billing-executor` |
| `ExecutorInstance` | 真实在线服务实例，带心跳和连接状态 |
| `JobGroupDefinition` | 任务组，绑定默认执行器 |
| `JobDefinition` | 任务定义，包含调度、目标、策略和参数 |

## 运行态数据

运行态数据包括 `nextFireTime`、execution、target、outbox、节点心跳和 shard lease。Firefly 把配置数据和运行态数据分开，避免一张任务表承载所有含义。

## 热路径

```text
load active jobs from store
        ->
build local TimingIndex
        ->
tick reads local due batch
        ->
advance runtime cursor
        ->
write execution and outbox
        ->
dispatch to local handler or remote executor
```

持久化存储是事实源，但不是每 500ms 扫描数据库的热路径。Scheduler 节点会把 active jobs 加载进本地时间索引，在 revision 或 shard ownership 变化时重载。

## Same-fire-time batch

多个任务拥有同一个 `nextFireTime` 时，Firefly 使用 same-fire-time batch dispatch 语义。这样同一批任务拥有相同 `scheduledFireTime`，便于观测调度延迟，也避免 soft limit 切开同一时间点的任务。
