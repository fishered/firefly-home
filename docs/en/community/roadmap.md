---
title: Roadmap
description: Firefly evolution direction.
---

# Roadmap

Firefly evolves around one principle: stabilize core scheduling semantics first, then add platform capabilities through independent modules.

## Current release: v1.2.1

Quota preview and capacity planning were released on November 7, 2026. The release delivers side-effect-free dry runs, five-resource capacity baselines, deterministic recommendations, data-quality labels, an Admin preview/apply workflow, and bounded fleet-wide exports.

## Near Term

- Improve Admin API request and response examples
- Add more Spring Boot Starter examples
- Improve execution history and troubleshooting in Admin UI
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
