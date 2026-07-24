---
title: Comparison
description: Selection differences between Firefly, Quartz, XXL-JOB, PowerJob, ElasticJob, and workflow systems.
---

# Comparison

This comparison is for selection guidance, not a winner table. Firefly is positioned as a lightweight Java scheduling service and evolvable scheduler center.

| Product type | Examples | Better for | Firefly difference |
|---|---|---|---|
| In-process scheduler | Quartz | Complex scheduling in one application | Firefly keeps a restrained core while preserving a path to standalone Server and remote Executor |
| Scheduling platform | XXL-JOB | Mature centralized task management and console | Firefly emphasizes Java 21, job-level time zones, module boundaries, and JDBC HA semantics |
| Distributed task scheduler | PowerJob | MapReduce, workflows, online logs, platform features | Firefly focuses on lightweight scheduling center and executor routing |
| Sharding scheduler | ElasticJob | Data sharding and registry-center coordination | Firefly uses JDBC shard lease and fencing token for scheduler ownership |
| Workflow orchestrator | Airflow, DolphinScheduler | DAGs, data orchestration, backfills, dependency scheduling | Firefly does not require jobs to be modeled as DAGs |

## Choose Firefly When

- Your system is Java-based and needs a lightweight scheduling core
- Job time semantics matter, especially across time zones or DST
- You need a unified console and API without adopting a large workflow platform
- Business services should actively connect to receive jobs
- Admin API, UI, Metrics, and transports should evolve independently
