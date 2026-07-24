---
title: Deployment
description: Recommended local, container, and cluster deployment paths.
---

# Deployment

Firefly can move gradually from local memory/H2 testing to PostgreSQL-backed single-node deployment and then to split api, gateway, and scheduler roles.

## Local Development

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=h2"
```

| Service | Default address |
|---|---|
| Admin UI | `http://127.0.0.1:9720` |
| Admin HTTP API | `http://127.0.0.1:9710` |
| Prometheus Metrics | `http://127.0.0.1:9711/metrics` |
| Netty Gateway | `127.0.0.1:9700` |

## Docker Compose

```powershell
docker compose up -d --build
```

## Node Roles

Standalone can enable all roles in one process:

```properties
firefly.node.roles=api,gateway,scheduler
```

Cluster deployments can split roles:

```properties
firefly.node.roles=api
firefly.node.roles=gateway
firefly.node.roles=scheduler
```

## Storage

| Profile | Use case |
|---|---|
| `memory` | Quick experiments and tests |
| `h2` | Local file persistence |
| `pg` | Local PostgreSQL default |

Production deployments should use PostgreSQL or MySQL and align `firefly.jdbc.schema.mode` with the team's migration process.
