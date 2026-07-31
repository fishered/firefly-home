---
title: Scheduler Core
description: Time, policy, and execution boundaries in Firefly scheduler-core.
---

# Scheduler Core

`libs/scheduler-core` stays pure Java. It does not depend on Spring, Guice, HTTP, databases, or specific runtimes.

## Capabilities

- 6-field cron: second, minute, hour, day, month, week
- fixed-rate scheduling
- job-level IANA `ZoneId`
- misfire policies: `SKIP`, `FIRE_ONCE`, `CATCH_UP`
- concurrency policies: `ALLOW`, `FORBID`
- local handler registry
- replaceable Clock for tests

## Executable schedule types

Job definitions accept only schedule types that the runtime can persist and execute. `CronSchedule` maps to `CRON`, and `FixedRateSchedule` maps to `FIXED_RATE`. Other `Schedule` implementations default to `UNSUPPORTED` and are rejected while building `JobDefinition`.

This keeps API, persistence, and scheduler-engine capability aligned. A new schedule type must add its domain model, time calculation, storage encoding, Admin API/UI support, and compatibility tests together; implementing one Java interface is not enough to persist a job.

## Time Rules

Jobs explicitly declare a `ZoneId`. Cron expressions are calculated in the job's local time, while runtime cursors are stored as UTC `Instant` values.

```java
JobDefinition job = JobDefinition.builder()
        .id("new-york-daily-report")
        .name("New York Daily Report")
        .handlerName("reportHandler")
        .schedule(new CronSchedule("0 0 9 * * *"))
        .zoneId(ZoneId.of("America/New_York"))
        .build();
```

## Misfire

| Policy | Meaning |
|---|---|
| `SKIP` | Skip missed fire times and advance to the next future time |
| `FIRE_ONCE` | Coalesce missed fire times into one compensation run |
| `CATCH_UP` | Catch up missed fire times within configured limits |
