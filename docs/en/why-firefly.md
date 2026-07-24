---
title: Why Firefly
description: Where Firefly fits best.
---

# Why Firefly

Firefly is for Java teams that want clear scheduling semantics, a light core, and a separate operational surface.

## Time Correctness

Many scheduling bugs come from default time zones, DST, deployment-machine configuration, and runtime cursors being mixed together. Firefly requires jobs to declare IANA `ZoneId` values and stores runtime state as UTC `Instant` values.

## Lightweight Core

`scheduler-core` stays pure Java. It can be embedded in a business process or hosted by standalone Server. HTTP, JDBC, Netty, and Prometheus live outside the core.

## Replaceable Modules

- `integrations/*` handles framework integration
- `stores/*` handles persistence
- `transports/*` handles remote executor communication
- `apis/*` handles management APIs
- `plugins/*` handles optional capabilities

## Operationally Friendly

Admin UI and Admin HTTP API are separated. Java API nodes return JSON; Node Admin UI handles pages, sessions, and proxying. The Prometheus plugin independently exposes `/metrics`.

## Not a Fit

Firefly is not a large DAG workflow engine or data orchestration platform. If your main requirements are complex dependency graphs, dataset lineage, manual approval flows, or backfill orchestration, a workflow engine may be a better fit.
