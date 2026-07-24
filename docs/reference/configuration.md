---
title: 配置参考
description: Firefly 常用配置项。
---

# 配置参考

Firefly 配置可以来自 properties、环境变量和 CLI 参数。CLI 参数优先级最高。

## 基础配置

```properties
firefly.config.profile=pg
firefly.node.mode=standalone
firefly.node.name=firefly-standalone
firefly.node.roles=api,gateway,scheduler
firefly.plugins=metrics-prometheus
```

## Admin HTTP

```properties
firefly.admin-http.host=127.0.0.1
firefly.admin-http.port=9710
```

## Admin UI

Admin UI 位于 `ui/admin`，默认：

```text
FIREFLY_ADMIN_UI_HOST=127.0.0.1
FIREFLY_ADMIN_UI_PORT=9720
FIREFLY_ADMIN_API=http://127.0.0.1:9710
```

## Metrics

```properties
firefly.metrics.prometheus.host=127.0.0.1
firefly.metrics.prometheus.port=9711
```

## Gateway

```properties
firefly.executor.gateway.netty.port=9700
firefly.executor.registration.auto-create-definition=true
```

## 安全

```properties
firefly.security.jwt.secret=firefly-local-development-signing-secret-unsafe-change-me
firefly.security.jwt.issuer=firefly
firefly.security.jwt.access-token-ttl=PT1H
```

本地默认账号由数据库初始化脚本创建：`admin/admin`。生产环境应立即修改密码并替换 JWT secret。

## Scheduler

```properties
firefly.scheduler.shard-count=32
firefly.scheduler.max-due-records-per-tick=10000
firefly.scheduler.max-idle-wakeup=PT0.5S
```

`firefly.scheduler.shard-count` 是集群不变量，首次初始化后不支持在线修改。

## Outbox

```properties
firefly.dispatch.outbox.poll-interval=PT0.2S
firefly.dispatch.outbox.claim-batch-size=50
firefly.dispatch.outbox.claim-duration=PT15S
firefly.dispatch.outbox.remote-ack-timeout=PT10S
firefly.dispatch.outbox.max-attempts=5
firefly.dispatch.outbox.max-retry-backoff=PT30S
```

## 数据库时钟

```properties
firefly.jdbc.clock.sync-interval=PT30S
firefly.jdbc.clock.drift-warning-threshold=PT1S
```

JDBC 节点使用数据库时间作为 lease、心跳和 outbox claim 的权威时间。
