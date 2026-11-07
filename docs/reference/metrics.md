---
title: Metrics 指标
description: Prometheus Metrics 插件暴露的核心指标。
---

# Metrics 指标

Prometheus Metrics 插件位于 `plugins/metrics-prometheus`，默认不随 server 自动加载。启用方式：

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.metrics.prometheus.enabled=true"
```

或通过插件列表启用：

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.plugins=metrics-prometheus"
```

默认地址：

```text
http://127.0.0.1:9711/metrics
```

## 核心指标

| 指标 | 说明 |
|---|---|
| `firefly_plugin_up` | 插件是否运行 |
| `firefly_jobs_total` | 任务总数 |
| `firefly_jobs_enabled` | 启用中的任务数 |
| `firefly_nodes_online` | 在线节点数 |
| `firefly_next_fire_time_epoch_seconds` | 下一次触发时间 |
| `firefly_jobs_due_total` | 到期任务累计数 |
| `firefly_jobs_overdue_max_seconds` | 最大逾期时间 |
| `firefly_schedule_delay_seconds` | 调度延迟 |
| `firefly_execution_duration_seconds` | 执行耗时 |
| `firefly_executor_connections` | Executor 连接数 |
| `firefly_scheduler_owned_shards` | 当前节点持有的 scheduler shard 数 |
| `firefly_database_clock_offset_milliseconds` | 数据库时钟偏移 |
| `firefly_tenant_capacity_observations_dropped_total{reason}` | 因缓冲满或关闭超时丢弃的容量观测 |
| `firefly_tenant_capacity_flush_failures_total{reason}` | 容量样本异步刷新失败次数 |
| `firefly_tenant_capacity_flush_lag_seconds` | 容量桶完成到持久化之间的延迟 |
| `firefly_tenant_quota_preview_total{risk}` | 按风险等级统计的配额预演次数 |

容量采集健康指标不包含 tenant ID，避免租户数扩大 Prometheus 基数。仓库中的 `config/prometheus/firefly-alerts.yml` 提供 p99 调度延迟、任务逾期、热点分片、Outbox 停滞、lease 失败、数据库时钟漂移、容量采集背压和 Executor 注册异常告警。
