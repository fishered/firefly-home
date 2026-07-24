---
title: Quick Start
description: Start Firefly Server, Admin UI, and demo jobs locally.
---

# Quick Start

Firefly is organized as a Java 21 and Gradle multi-module project. Start the Server locally, then open the standalone Admin UI to inspect jobs, executors, nodes, and plugins.

## Requirements

- JDK 21
- Node.js 18 or later for Admin UI and this documentation site
- PostgreSQL is optional for local development; H2 and memory profiles are available for quick checks

## Run Tests

```powershell
.\gradlew.bat test
```

## Start Server

The default profile is `pg`, which connects to local PostgreSQL:

```powershell
.\gradlew.bat :server:launcher:run
```

For local preview, H2 is usually easier:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=h2"
```

Memory storage:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.config.profile=memory"
```

Enable demo jobs:

```powershell
.\gradlew.bat :server:launcher:run --args="--firefly.demo.enabled=true"
```

## Open Admin UI

Admin UI listens on:

```text
http://127.0.0.1:9720
```

Admin HTTP API listens on:

```text
http://127.0.0.1:9710
```

Prometheus Metrics:

```text
http://127.0.0.1:9711/metrics
```

## First Job

```java
JobDefinition job = JobDefinition.builder()
        .id("demo-print-every-5s")
        .name("Demo print every five seconds")
        .handlerName("demoPrinter")
        .schedule(new CronSchedule("*/5 * * * * *"))
        .zoneId(ZoneId.of("Asia/Shanghai"))
        .misfirePolicy(MisfirePolicy.FIRE_ONCE)
        .misfireGrace(Duration.ofSeconds(2))
        .concurrencyPolicy(ConcurrencyPolicy.FORBID)
        .maxCatchUpCount(3)
        .timeout(Duration.ofSeconds(10))
        .enabled(true)
        .build();
```

Spring Boot projects can register jobs through `FireflyJobRegistration` beans or `@FireflyJob`. Remote services can connect to the scheduler center with the Netty Executor Client.
