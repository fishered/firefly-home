---
title: Release Note
description: Release dates, change scope, and upgrade entry points for every Firefly version.
---

# Release Note

This page summarizes published Firefly versions. Each version records only the scope handled by that release; installation and environment setup remain in the deployment guide.

| Version | Release date | Scope |
|---|---|---|
| [v1.0.8](./v1.0.8.md) | August 25, 2026 | Release consistency and verification: aligned Docker/Compose versions, CI compatibility checks, trace version identity, and bounded carriers |
| [v1.0.6](./v1.0.6.md) | August 9, 2026 | Runtime stability and resource boundaries: timing-index recovery, local worker backpressure, atomic `FORBID`, batched lease renewal, revision throttling, and bounded HTTP executors |
| [v1.0.5](./v1.0.5.md) | Not released separately | Non-Spring Java integration candidate; the work was formally delivered in v1.0.6 |
| [v1.0.4](./v1.0.4.md) | August 4, 2026 | Scheduler reliability verification: same-due-time PostgreSQL stress tests, concurrent Scheduler/Outbox contention checks, resource observations, and a repeatable stress-test entry point |
| [v1.0.3](./v1.0.3.md) | August 2, 2026 | Runtime ownership and input boundaries: transactional Execution/Outbox entry points, typed critical Admin writes, bounded worker shutdown, typed Netty frames, and a versioned snapshot envelope |
| [v1.0.2](./v1.0.2.md) | July 31, 2026 | Architecture and recovery boundaries: declarative Admin RBAC, Netty wire models and backpressure, plugin API levels, JDBC fencing, real-database failure verification, and controlled shard expansion |
| [v1.0.1](./v1.0.1.md) | July 29, 2026 | Production hardening: secure defaults, database migrations, bounded executor resources, dispatch timeouts, Starter health reporting, and reproducible builds |

For new deployments or the database initialization script, see [Deployment](../guide/deployment.md).
