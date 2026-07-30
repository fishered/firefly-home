---
title: JDBC and HA
description: JDBC persistence, shard lease, and fencing token.
---

# JDBC and HA

Firefly uses JDBC storage for job definitions, nodes, shard leases, executions, outbox, audit logs, and Admin users. H2, PostgreSQL, and MySQL schema scripts are available.

## Shard Lease

Scheduler nodes acquire shard ownership through `firefly_shard_lease`. Lease renewal or takeover increments a fencing token to stop old owners from advancing jobs after network stalls or long pauses.

Key rules:

- All nodes share the same `firefly.scheduler.shard-count`
- Database time is authoritative for node liveness, leases, and outbox claims
- When the database is unavailable, Firefly does not generate new unfenced executions

## Outbox

Runtime cursor CAS, execution creation, and outbox insertion happen in one transaction. Remote dispatch can retry through outbox records.

## Schema

The current schema version is `12`. Fresh PostgreSQL installations use the canonical minimal script, while existing databases apply ordered dialect migrations.

```text
scripts/postgresql/init.sql
stores/jdbc/src/main/resources/com/firefly/store/jdbc/schema/migrations/{h2,postgresql,mysql}/v12.sql
```

See [Deployment](../guide/deployment.md#postgresql-database-initialization) for the script download, checksum, and execution instructions.
