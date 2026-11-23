---
title: Roadmap
description: Firefly evolution direction.
---

# Roadmap

Firefly evolves around one principle: stabilize core scheduling semantics first, then add platform capabilities through independent modules.

## Current release: v1.2.2

Setup and operations diagnosis were released on November 23, 2026. The release provides readiness checks, a four-step job wizard, an action center, an execution timeline, and version-checked job edits.

## Near Term

- Improve Admin API request and response examples
- Add more Spring Boot Starter examples
- Extend the action center to complete alert queries and precise event timestamps
- Expand Prometheus alert templates
- Add compatibility tests for external plugins
- Expand capacity-report operating examples and real PostgreSQL/MySQL performance baselines

## Mid Term

- tracing plugin
- more Executor transports
- import and export for jobs
- cluster maintenance tools
- schema migration tooling improvements
- elastic quota and burst credits after admission and accounting semantics are explicitly defined

## Long-Term Principles

- Do not put web, storage, monitoring, or transport protocols into scheduler-core
- Do not let default time zones define job semantics
- Do not generate unfenced executions when the database is unavailable
- Do not re-couple Admin UI and Java API
- Do not auto-apply quota recommendations or present historical peaks as machine-learned capacity guarantees
