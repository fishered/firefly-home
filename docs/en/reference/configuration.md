---
title: Configuration
description: Common Firefly configuration properties.
---

# Configuration

Firefly configuration can come from properties files, environment variables, and CLI arguments. CLI arguments have the highest priority.

## Base

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

## Security

```properties
firefly.security.jwt.secret=firefly-local-development-signing-secret-unsafe-change-me
firefly.security.jwt.issuer=firefly
firefly.security.jwt.access-token-ttl=PT1H
```

The local default account is `admin/admin`. Production deployments should rotate the password and replace the JWT secret.

## Scheduler

```properties
firefly.scheduler.shard-count=32
firefly.scheduler.max-due-records-per-tick=10000
firefly.scheduler.max-idle-wakeup=PT0.5S
```

`firefly.scheduler.shard-count` is a cluster invariant and cannot be changed online after initialization.
