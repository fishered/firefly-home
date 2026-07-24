---
title: Technical Components
description: Firefly core, store, transport, API, and plugin components.
---

# Technical Components

Firefly separates scheduling semantics, persistence, executor communication, operational APIs, and plugin lifecycle.

| Component | Module | Responsibility |
|---|---|---|
| Scheduler Core | `libs/scheduler-core` | cron/fixed-rate, time zones, misfire, concurrency policy |
| Admin Model | `apis/admin-model` | Admin DTOs and view models |
| Admin HTTP | `apis/admin-http` | JSON API, authentication, RBAC, audit |
| JDBC Store | `stores/jdbc` | Jobs, nodes, leases, executions, outbox, audit |
| Netty Transport | `transports/netty` | Executor registration, heartbeat, trigger, ACK, result |
| Plugin API | `plugins/plugin-api` | Plugin lifecycle, configuration, status |
| Metrics | `plugins/metrics-prometheus` | Prometheus text metrics |
| Admin UI | `ui/admin` | Standalone Node console that proxies `/api/*` |

## Read Next

- [Scheduler Core](./scheduler-core)
- [Scheduler Center](./scheduler-center)
- [Netty Executor](./netty-executor)
- [JDBC and HA](./ha-cluster)
- [Plugin System](./plugins)
