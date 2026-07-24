---
title: Metrics
description: Core metrics exposed by Prometheus Metrics plugin.
---

# Metrics

The Prometheus Metrics plugin lives in `plugins/metrics-prometheus`.

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.metrics.prometheus.enabled=true"
```

Or enable it through the plugin list:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.plugins=metrics-prometheus"
```

Default endpoint:

```text
http://127.0.0.1:9711/metrics
```

## Core Metrics

| Metric | Description |
|---|---|
| `firefly_plugin_up` | Whether the plugin is running |
| `firefly_jobs_total` | Total jobs |
| `firefly_jobs_enabled` | Enabled jobs |
| `firefly_nodes_online` | Online nodes |
| `firefly_next_fire_time_epoch_seconds` | Next fire time |
| `firefly_jobs_due_total` | Due jobs total |
| `firefly_jobs_overdue_max_seconds` | Maximum overdue duration |
| `firefly_schedule_delay_seconds` | Scheduling delay |
| `firefly_execution_duration_seconds` | Execution duration |
| `firefly_executor_connections` | Executor connections |
| `firefly_scheduler_owned_shards` | Shards owned by this scheduler |
| `firefly_database_clock_offset_milliseconds` | Database clock offset |

`config/prometheus/firefly-alerts.yml` contains alert templates for schedule delay, overdue jobs, hot shards, outbox stalls, lease failures, database clock drift, and executor registration errors.
