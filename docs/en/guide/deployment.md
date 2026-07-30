---
title: Deployment
description: Recommended local, container, and cluster deployment paths.
---

<script setup>
import { withBase } from 'vitepress';
</script>

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

## PostgreSQL Database Initialization

With `initialize-if-empty`, Firefly initializes an empty database on first startup. No manual SQL download or execution is required:

```properties
firefly.jdbc.schema.mode=initialize-if-empty
```

When a DBA or external migration system owns the production schema, download the minimal initialization script for the deployed version:

<a :href="withBase('/downloads/firefly-postgresql-init-v1.0.1.sql')" download="firefly-postgresql-init-v1.0.1.sql">Download the minimal PostgreSQL initialization script (v1.0.1)</a>

SHA-256:

```text
d6cc52ad804245b202b1da127730448211c22513c524be4d46f2744667bd7d24
```

The script creates only Firefly-managed tables, indexes, schema metadata, and the bootstrap administrator. Database creation, roles, and grants remain operator-owned. Prepare the database and account first, then run:

```powershell
psql -h 127.0.0.1 -U firefly -d firefly -f .\firefly-postgresql-init-v1.0.1.sql
```

After applying the script, set `firefly.jdbc.schema.mode` to `validate`. The default administrator is `admin/admin` and must change its password on first login.
