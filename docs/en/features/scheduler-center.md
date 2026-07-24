---
title: Scheduler Center
description: Jobs, groups, executors, instances, and runtime state.
---

# Scheduler Center

Firefly's scheduling center is organized around configuration entities and runtime state.

```text
JobDefinition -> JobGroupDefinition -> ExecutorDefinition -> ExecutorInstance
```

## Configuration Data

| Model | Description |
|---|---|
| `ExecutorDefinition` | Logical executor definition, such as `billing-executor` |
| `ExecutorInstance` | Online service instance with heartbeat and connection state |
| `JobGroupDefinition` | Job group bound to a default executor |
| `JobDefinition` | Job schedule, target, policy, and parameters |

## Runtime Data

Runtime data includes `nextFireTime`, executions, targets, outbox records, node heartbeats, and shard leases. Firefly separates configuration and runtime state so one table does not carry every meaning.

## Hot Path

```text
load active jobs from store
        ->
build local TimingIndex
        ->
tick reads local due batch
        ->
advance runtime cursor
        ->
write execution and outbox
        ->
dispatch to local handler or remote executor
```

Persistent storage is the source of truth, but the scheduler does not scan the database on every short tick.
