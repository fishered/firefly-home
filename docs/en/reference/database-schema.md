---
title: Database Schema
description: Firefly JDBC schema table responsibilities.
---

# Database Schema

The current schema version is `12`. The canonical minimal script for a fresh PostgreSQL installation is:

```text
scripts/postgresql/init.sql
```

See [Deployment](../guide/deployment.md#postgresql-database-initialization) for the script download, checksum, and execution instructions.

Existing databases apply dialect-specific migrations. Core compatibility remains version `12`; the 1.2.1 additive feature migration is `v21.sql`:

```text
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/h2/v21.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/postgresql/v21.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/mysql/v21.sql
```

## Tables

| Table | Responsibility |
|---|---|
| `firefly_schema_version` | Installed schema versions |
| `firefly_cluster_metadata` | Cluster invariants such as scheduler shard count |
| `firefly_node` | Server node roles, registration, heartbeat, online state |
| `firefly_shard_lease` | Scheduler shard ownership, lease, fencing token |
| `firefly_executor` | Logical executor definitions |
| `firefly_job_group` | Job groups, default executor binding, metadata, enabled state |
| `firefly_job` | Job definitions, scheduling cursor, dispatch policy, shard id |
| `firefly_execution` | Parent execution attempt and aggregate status |
| `firefly_execution_target` | Target execution records for unicast, broadcast, or shards |
| `firefly_dispatch_outbox` | Reliable dispatch queue, role routing, ACK timeout, retry state |
| `firefly_executor_instance_location` | Gateway and session fencing for executor instances |
| `firefly_audit_log` | Admin change audit |
| `firefly_job_history` | Job create, enable/disable, and delete history |
| `firefly_user` | Admin users, PBKDF2 password digest, roles, first-login password state, and version |
| `firefly_integration_key` | PBKDF2 digest and rotation version of Integration Key |
| `firefly_tenant_policy` | Versioned tenant weight, enablement, and five resource limits |
| `firefly_tenant_usage` | Authoritative concurrency, CPU, memory, backlog, and trigger-window usage |
| `firefly_tenant_reservation` | Idempotent admission reservations and recovery leases |
| `firefly_dispatch_fairness_state` | Durable tenant virtual finish times and global fair clock |
| `firefly_tenant_capacity_sample` | Five-minute capacity buckets, version ranges, resource peaks, saturation, and rejections |
| `firefly_tenant_capacity_flush` | Idempotency keys for source/bucket flushes |

## Initialization Modes

```properties
firefly.jdbc.schema.mode=initialize-if-empty
```

For externally managed production migrations:

```properties
firefly.jdbc.schema.mode=validate
```

`initialize-if-empty` checks the installed state and applies missing core and feature migrations in order. `validate` checks only and does not modify the database. Externally migrated databases must contain core schema version `12`, with v20 tenant-governance tables and v21 capacity-sample tables installed. v21 only adds tables, so 1.2.0 and 1.2.1 can coexist during a rolling upgrade.
