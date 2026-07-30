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

Existing databases apply each missing dialect migration in order. The schema `12` migrations are:

```text
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/h2/v12.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/postgresql/v12.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/mysql/v12.sql
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

## Initialization Modes

```properties
firefly.jdbc.schema.mode=initialize-if-empty
```

For externally managed production migrations:

```properties
firefly.jdbc.schema.mode=validate
```

`initialize-if-empty` checks the installed version and applies every missing incremental SQL file in order. `validate` checks only and does not modify the database; externally migrated databases must contain schema version `12`.
