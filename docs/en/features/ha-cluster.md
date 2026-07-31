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

## Controlled shard expansion

`firefly.scheduler.shard-count` is a cluster invariant and must not be changed by rolling out a different configuration. `v1.0.2` provides an `expand-online` maintenance action that only increases shard count while allowing data-plane-only Gateway and Executor nodes to stay online.

Before running it:

1. Back up the database and record the current shard count.
2. Drain and stop every node with a `SCHEDULER`, `STANDBY`, or `API` role.
3. Confirm there are no active executions and no Outbox records outside `DONE` or `DEAD`.
4. Prepare the same target shard count for every control-plane node that will restart.

To expand a PostgreSQL profile to 64 shards:

```powershell
.\gradlew.bat :server:launcher:migrateSchema --args="--firefly.config.profile=pg --firefly.schema.action=expand-online --firefly.schema.reshard.confirm=true --firefly.scheduler.shard-count=64"
```

Under the database migration lock and one transaction, the tool recomputes every job `shard_id`, updates `scheduler.shard-count` and `jobs.revision`, and deletes old leases. After success, start Scheduler/API nodes with the target count and observe lease redistribution.

`expand-online` does not support contraction and is not a role-transparent dual-routing migration. A failed command rolls back its transaction. Keep control-plane nodes offline, read the actual database shard count, and then choose whether to retry or restore the previous configuration. Contraction requires a full outage and `firefly.schema.action=reshard`.
