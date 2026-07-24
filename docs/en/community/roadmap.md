---
title: Roadmap
description: Firefly evolution direction.
---

# Roadmap

Firefly evolves around one principle: stabilize core scheduling semantics first, then add platform capabilities through independent modules.

## Near Term

- Improve Admin API request and response examples
- Add more Spring Boot Starter examples
- Improve execution history and troubleshooting in Admin UI
- Expand Prometheus alert templates
- Add compatibility tests for external plugins

## Mid Term

- tracing plugin
- more Executor transports
- import and export for jobs
- cluster maintenance tools
- schema migration tooling improvements

## Long-Term Principles

- Do not put web, storage, monitoring, or transport protocols into scheduler-core
- Do not let default time zones define job semantics
- Do not generate unfenced executions when the database is unavailable
- Do not re-couple Admin UI and Java API
