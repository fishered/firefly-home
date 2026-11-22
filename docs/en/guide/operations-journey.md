---
title: Getting Started and Diagnosing Executions
description: Check readiness, run the first remote job, and investigate failures in the Admin UI.
---

# Getting Started and Diagnosing Executions

The Admin UI follows a setup → create → run → diagnose → adjust path. This page describes the v1.2.2 console changes. See [Quick Start](./quick-start.md) for installation.

## Run your first remote job

1. Start Firefly Server and Admin UI, sign in, and open **Overview → Getting started**.
2. Check API and database, Gateway, authentication, Integration Key, Executor, Handler, and a successful first execution. Each pending check links to the relevant page.
3. Generate an Integration Key under **Accounts & security** and save it immediately. Only a digest remains on the server.
4. Copy the Spring Boot YAML, replace the executor name and network addresses, and supply the key through `FIREFLY_INTEGRATION_KEY`.
5. Start your service, create a job through the four-step wizard, trigger it, and confirm success in **Executions**.

## Investigate a problem

Open **Operations → Action center**. Each item shows a reason, impact, suggested action, and related object. Its action opens the relevant execution, executor, backfill, tenant, or node page.

Execution details read `GET /api/executions/{id}/timeline` and arrange trigger, quota admission, Outbox, Gateway, ACK, execution, and retry/replay. “No observed data” means no event is persisted for that stage. It does not imply success or failure. The target table still provides instance, Gateway, ACK, and error details.

Preview job and tenant changes before applying them. Editing the form invalidates its preview, and request errors preserve input. Both use server-side `expectedVersion` compare-and-set and return 409 on conflict. Scheduling also advances a job's version, so an active job may occasionally require reopening and previewing again; the form retains the entered values for review.

The Action center aggregates current paginated data. It is not a complete historical alert index.
